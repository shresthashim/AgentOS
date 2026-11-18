"use client";

import { RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { FlowStep } from "@/lib/site";
import { drawFace, type FaceState } from "./node-face";

const CARD = { w: 2.7, h: 1.27, d: 0.26 };
const GAP = 3.35;
const GAP_V = 1.85;
const SEGMENT_SECONDS = 0.85;
const APPROVAL_HOLD = 1.5;
const END_HOLD = 1.4;

type Props = { steps: FlowStep[]; flowKey: string; reduced: boolean; dark: boolean };

/** Scene colours per theme; the page's own tokens can't reach into WebGL. */
const PALETTE = {
  light: {
    card: "#ffffff",
    wire: "#aab3cc",
    dots: [150, 160, 190, 0.55],
    shadow: "16,22,47",
    shadowOpacity: 0.55,
    pulse: "#3454bf",
    glow: "120,150,255",
    ambient: 1.6,
  },
  dark: {
    card: "#161d3d",
    wire: "#45518a",
    dots: [92, 106, 165, 0.6],
    shadow: "0,0,0",
    shadowOpacity: 0.85,
    pulse: "#7d96ff",
    glow: "110,140,255",
    ambient: 1.1,
  },
} as const;

/** Left to right on wide screens; top to bottom on narrow ones. */
function layout(count: number, vertical: boolean) {
  if (vertical) {
    const top = ((count - 1) * GAP_V) / 2;
    return Array.from({ length: count }, (_, i) => new THREE.Vector3(i % 2 ? 0.5 : -0.5, top - i * GAP_V, 0));
  }
  const start = -((count - 1) * GAP) / 2;
  return Array.from({ length: count }, (_, i) => new THREE.Vector3(start + i * GAP, i % 2 ? -0.42 : 0.42, 0));
}

function wire(from: THREE.Vector3, to: THREE.Vector3, vertical: boolean) {
  const a = vertical
    ? new THREE.Vector3(from.x, from.y - CARD.h / 2, 0.05)
    : new THREE.Vector3(from.x + CARD.w / 2, from.y, 0.05);
  const b = vertical
    ? new THREE.Vector3(to.x, to.y + CARD.h / 2, 0.05)
    : new THREE.Vector3(to.x - CARD.w / 2, to.y, 0.05);
  const pull = vertical
    ? new THREE.Vector3(0, (b.y - a.y) * 0.55, 0)
    : new THREE.Vector3((b.x - a.x) * 0.55, 0, 0);
  return new THREE.CubicBezierCurve3(a, a.clone().add(pull), b.clone().sub(pull), b);
}

/** Soft round textures, drawn once: a glow for the pulse and a shadow for cards. */
function useRadial(inner: string, outer: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [inner, outer]);
}

/** The dotted builder canvas the cards sit on, fading out at its edges. */
function useDotTexture(rgba: readonly [number, number, number, number]) {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const step = 32;
    for (let y = step / 2; y < size; y += step)
      for (let x = step / 2; x < size; x += step) {
        const dx = (x - size / 2) / (size / 2);
        const dy = (y - size / 2) / (size / 2);
        const fade = Math.max(0, 1 - Math.sqrt(dx * dx * 0.7 + dy * dy * 1.6));
        ctx.fillStyle = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3] * fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [rgba]);
}

function CameraRig({ width, height }: { width: number; height: number }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const half = Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2));
    const aspect = size.width / Math.max(size.height, 1);
    const distance = Math.max(width / (2 * half * aspect), height / (2 * half));
    perspective.position.set(0, -distance * 0.08, distance);
    perspective.lookAt(0, 0.1, 0);
  });
  return null;
}

function Scene({ steps, flowKey, reduced, dark }: Props) {
  const colors = dark ? PALETTE.dark : PALETTE.light;
  const { size, gl } = useThree();
  const anisotropy = gl.capabilities.getMaxAnisotropy();
  const vertical = size.width / Math.max(size.height, 1) < 1.05;
  const positions = useMemo(() => layout(steps.length, vertical), [steps.length, vertical]);
  const curves = useMemo(
    () => positions.slice(0, -1).map((p, i) => wire(p, positions[i + 1]!, vertical)),
    [positions, vertical],
  );
  const wires = useMemo(() => curves.map((c) => new THREE.TubeGeometry(c, 48, 0.03, 8, false)), [curves]);
  const glow = useRadial(`rgba(${colors.glow},1)`, `rgba(${colors.glow},0)`);
  const shadow = useRadial(`rgba(${colors.shadow},0.35)`, `rgba(${colors.shadow},0)`);
  const dots = useDotTexture(colors.dots);

  const approvalIndex = steps.findIndex((s) => s.kind === "Approval");
  // Card faces for both themes are drawn up front, so a theme switch swaps them
  // in the same frame as the rest of the page.
  type FaceSet = { list: THREE.Texture[]; approved?: THREE.Texture };
  const [faces, setFaces] = useState<{ key: string; light: FaceSet; dark: FaceSet } | null>(null);
  useEffect(() => {
    let cancelled = false;
    const drawSet = async (isDark: boolean): Promise<FaceSet> => ({
      list: await Promise.all(
        steps.map((s) => drawFace(s, s.kind === "Approval" ? "waiting" : "normal", anisotropy, isDark)),
      ),
      approved:
        approvalIndex >= 0
          ? await drawFace(steps[approvalIndex]!, "approved" as FaceState, anisotropy, isDark)
          : undefined,
    });
    void Promise.all([drawSet(false), drawSet(true)]).then(([light, darkSet]) => {
      if (!cancelled) setFaces({ key: flowKey, light, dark: darkSet });
    });
    return () => {
      cancelled = true;
    };
  }, [steps, flowKey, approvalIndex, anisotropy]);
  const faceSet = faces ? (dark ? faces.dark : faces.light) : null;

  const group = useRef<THREE.Group>(null);
  const cards = useRef<(THREE.Group | null)[]>([]);
  const approvalFace = useRef<THREE.MeshBasicMaterial>(null);
  const pulse = useRef<THREE.Group>(null);
  const shown = useRef(0);
  const clock = useRef({ t: 0, flow: "" });
  const { pointer } = useThree();
  const scratch = useMemo(() => new THREE.Vector3(), []);

  const ready = faces?.key === flowKey;
  // One cycle: travel each wire, hold at the approval card, then rest at the end.
  const travel = curves.length * SEGMENT_SECONDS;
  const cycle = travel + (approvalIndex > 0 ? APPROVAL_HOLD : 0) + END_HOLD;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (clock.current.flow !== flowKey) {
      clock.current = { t: 0, flow: flowKey };
      shown.current = 0;
    }
    if (ready) shown.current += dt;
    clock.current.t += ready ? dt : 0;

    // Gentle tilt toward the pointer.
    if (group.current) {
      const tx = -0.18 + (reduced ? 0 : pointer.y * 0.04);
      const ty = reduced ? 0 : pointer.x * 0.08;
      const ease = 1 - Math.exp(-dt * 3);
      group.current.rotation.x += (tx - group.current.rotation.x) * ease;
      group.current.rotation.y += (ty - group.current.rotation.y) * ease;
    }

    // Cards rise in one after another when a workflow is chosen.
    cards.current.forEach((card, i) => {
      if (!card) return;
      const local = reduced ? 1 : THREE.MathUtils.clamp((shown.current - i * 0.09) / 0.45, 0, 1);
      const eased = 1 - Math.pow(1 - local, 3);
      card.scale.setScalar(0.6 + eased * 0.4);
      card.position.z = (1 - eased) * -0.6 + 0.2;
      card.visible = local > 0;
    });
    // Wires draw in behind them.
    wires.forEach((geometry, i) => {
      const local = reduced ? 1 : THREE.MathUtils.clamp((shown.current - 0.3 - i * 0.09) / 0.5, 0, 1);
      geometry.setDrawRange(0, Math.floor(local * 48) * 8 * 6);
    });

    // The pulse of data moving through the flow.
    const settle = 0.9 + steps.length * 0.09;
    const time = reduced ? 0 : Math.max(0, clock.current.t - settle) % cycle;
    let progress = time / SEGMENT_SECONDS;
    let approved = reduced;
    const holdStart = approvalIndex * SEGMENT_SECONDS;
    if (!reduced && approvalIndex > 0) {
      if (time >= holdStart && time < holdStart + APPROVAL_HOLD) {
        progress = approvalIndex;
        approved = time > holdStart + APPROVAL_HOLD * 0.55;
      } else if (time >= holdStart + APPROVAL_HOLD) {
        progress = (time - APPROVAL_HOLD) / SEGMENT_SECONDS;
        approved = true;
      }
    }
    if (approvalFace.current && faceSet?.approved && ready) {
      const want = approved ? faceSet.approved : faceSet.list[approvalIndex]!;
      if (approvalFace.current.map !== want) approvalFace.current.map = want;
    }
    if (pulse.current) {
      const segment = Math.min(Math.floor(progress), curves.length - 1);
      const along = THREE.MathUtils.clamp(progress - segment, 0, 1);
      const visible = !reduced && ready && progress < curves.length && clock.current.t > settle;
      pulse.current.visible = visible;
      if (visible && curves[segment]) {
        curves[segment].getPointAt(along, scratch);
        pulse.current.position.set(scratch.x, scratch.y, 0.22);
        const s = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.08;
        pulse.current.scale.setScalar(s);
      }
    }
  });

  const span = vertical ? CARD.w + 1.25 : (steps.length - 1) * GAP + CARD.w + 1.6;
  const tall = vertical ? (steps.length - 1) * GAP_V + CARD.h + 0.9 : 4.2;
  return (
    <>
      <ambientLight intensity={colors.ambient} />
      <directionalLight position={[-4, 6, 10]} intensity={1.6} />
      <group ref={group} rotation={[-0.18, 0, 0]}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={vertical ? [9, tall + 4] : [span + 6, 9]} />
          <meshBasicMaterial map={dots} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        {wires.map((geometry, i) => (
          <mesh key={`${flowKey}-${vertical}-w${i}`} geometry={geometry} position={[0, 0, 0.2]}>
            <meshStandardMaterial color={colors.wire} roughness={0.5} />
          </mesh>
        ))}
        {positions.map((p, i) => (
          <group
            key={`${flowKey}-${i}`}
            position={[p.x, p.y, 0.2]}
            ref={(node) => {
              cards.current[i] = node;
            }}
            visible={false}
          >
            <sprite position={[0.12, -0.3, -0.2]} scale={[CARD.w * 1.35, CARD.h * 1.9, 1]}>
              <spriteMaterial map={shadow} transparent depthWrite={false} opacity={colors.shadowOpacity} />
            </sprite>
            <RoundedBox args={[CARD.w, CARD.h, CARD.d]} radius={0.12} smoothness={4}>
              <meshStandardMaterial color={colors.card} roughness={0.55} />
            </RoundedBox>
            {ready ? (
              <mesh position={[0, 0, CARD.d / 2 + 0.002]}>
                <planeGeometry args={[CARD.w - 0.08, CARD.h - 0.08]} />
                <meshBasicMaterial
                  ref={i === approvalIndex ? approvalFace : undefined}
                  map={faceSet!.list[i]}
                  transparent
                  toneMapped={false}
                />
              </mesh>
            ) : null}
          </group>
        ))}
        <group ref={pulse} visible={false}>
          <mesh>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshBasicMaterial color={colors.pulse} toneMapped={false} />
          </mesh>
          <sprite scale={[0.75, 0.75, 1]}>
            <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      </group>
      <CameraRig width={span} height={tall} />
    </>
  );
}

export default function FlowScene({ active, ...props }: Props & { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ fov: 11, position: [0, -6, 60], near: 0.1, far: 300 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
