import * as THREE from "three";
import type { FlowStep } from "@/lib/site";
import { iconUrl, isApp } from "@/components/step-icon";

/** Face of a step card, drawn once into a canvas and used as a texture. */
export const FACE = { width: 640, height: 300 };

export type FaceState = "normal" | "waiting" | "approved";

const images = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string) {
  let image = images.get(src);
  if (!image) {
    image = new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = src;
    });
    images.set(src, image);
  }
  return image;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

export async function drawFace(
  step: FlowStep,
  state: FaceState,
  anisotropy = 16,
  dark = false,
): Promise<THREE.CanvasTexture> {
  await document.fonts.ready;
  const family = getComputedStyle(document.body).fontFamily;
  // Draw well above screen size, so text stays sharp after the GPU scales it down.
  const scale = Math.min(3, Math.max(2, window.devicePixelRatio * 1.5));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(FACE.width * scale);
  canvas.height = Math.round(FACE.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.imageSmoothingQuality = "high";
  const approval = step.kind === "Approval";
  // Same colours as the page tokens for each theme.
  const ink = dark
    ? { face: "#161d3d", title: "#eef1fb", muted: "#b3bbda", cobalt: "#8ea3ff" }
    : { face: "#ffffff", title: "#10162f", muted: "#4a5372", cobalt: "#3454bf" };
  const tone =
    state === "waiting"
      ? { accent: dark ? "#f3c56b" : "#c27a0e", tint: dark ? "#3a2b0e" : "#fff4df", label: "Waiting for approval" }
      : state === "approved"
        ? { accent: dark ? "#62d79f" : "#157a4c", tint: dark ? "#0e3122" : "#e3f6ec", label: "Approved" }
        : step.kind === "AI step"
          ? { accent: ink.cobalt, tint: dark ? "#1e2853" : "#e8edfc", label: step.kind }
          : { accent: dark ? "#949dc2" : "#5d6582", tint: dark ? "#222b52" : "#f1f3f8", label: step.kind };

  ctx.fillStyle = ink.face;
  roundRect(ctx, 0, 0, FACE.width, FACE.height, 34);
  ctx.fill();

  // Icon tile.
  ctx.fillStyle = tone.tint;
  roundRect(ctx, 36, 40, 96, 96, 22);
  ctx.fill();
  const iconColor = approval ? tone.accent : step.kind === "AI step" ? ink.cobalt : ink.muted;
  const icon = await loadImage(iconUrl(step.icon, iconColor));
  const size = isApp(step.icon) ? 54 : 50;
  // GitHub and Notion marks are near-black; use their light form on dark cards.
  if (dark && (step.icon === "github" || step.icon === "notion")) ctx.filter = "invert(1)";
  if (dark && step.icon === "slack") ctx.filter = "brightness(2.6) saturate(1.15)";
  ctx.drawImage(icon, 36 + (96 - size) / 2, 40 + (96 - size) / 2, size, size);
  ctx.filter = "none";

  // Kind label, with a status dot for approvals.
  ctx.font = `600 32px ${family}`;
  ctx.fillStyle = tone.accent;
  let labelX = 156;
  if (approval) {
    ctx.beginPath();
    ctx.arc(labelX + 9, 88, 9, 0, Math.PI * 2);
    ctx.fill();
    labelX += 28;
  }
  ctx.fillText(tone.label, labelX, 99);

  // Title.
  ctx.font = `700 46px ${family}`;
  ctx.fillStyle = ink.title;
  wrap(ctx, step.title, FACE.width - 72).forEach((line, i) => {
    ctx.fillText(line, 36, 206 + i * 54);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = anisotropy;
  return texture;
}
