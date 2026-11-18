import { BrandMark } from "@/components/brand";
import { APP_URL } from "@/lib/site";

/** App tiles around the panel's edges, wired to the AgentOS mark behind the headline. */
const TILES = [
  { slug: "gmail", x: 9, y: 24 },
  { slug: "googlesheets", x: 6, y: 68 },
  { slug: "slack", x: 22, y: 88 },
  { slug: "notion", x: 91, y: 22 },
  { slug: "googlecalendar", x: 94, y: 64 },
  { slug: "github", x: 79, y: 88 },
  { slug: "todoist", x: 80, y: 8 },
];

export function Cta() {
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-28">
      <div className="wrap">
        <div className="on-night relative overflow-hidden rounded-[2.25rem] bg-night px-6 py-20 text-center text-night-ink sm:px-12 sm:py-28">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(#2c3770_1.3px,transparent_1.3px)] [background-size:24px_24px] [mask-image:radial-gradient(75%_85%_at_50%_50%,black,transparent)]"
          />
          {/* Wires from every app to the middle, with data flowing along them. */}
          <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full md:block">
            {TILES.map((t, i) => (
              <g key={t.slug}>
                <path d={`M${t.x} ${t.y} C 50 ${t.y}, 50 ${t.y}, 50 50`} fill="none" stroke="#34407c" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                <path
                  d={`M${t.x} ${t.y} C 50 ${t.y}, 50 ${t.y}, 50 50`}
                  fill="none"
                  stroke="#7d96ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="wire-flow-px"
                  style={{ animationDelay: `${i * 0.45}s` }}
                />
              </g>
            ))}
          </svg>
          {TILES.map((t) => (
            <span
              key={t.slug}
              aria-hidden="true"
              className="absolute hidden size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-night-line bg-[#f4f6fd] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] md:flex"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/apps/${t.slug}.svg`} alt="" width={26} height={26} className="size-[26px] [filter:none]!" />
            </span>
          ))}

          <div className="relative mx-auto max-w-[40rem] rounded-[2rem] bg-night/80 px-2 py-4 backdrop-blur-[2px]">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-cobalt text-white shadow-[0_20px_50px_-15px_rgb(75_104_227/0.8)]">
              <BrandMark size={30} />
            </span>
            <h2 id="cta-title" className="display mx-auto mt-7 max-w-[15ch] text-[length:clamp(2.3rem,1.3rem+3.6vw,4.4rem)]">
              Put your weekly busywork on autopilot
            </h2>
            <p className="lede mx-auto mt-5 max-w-[42ch] text-night-muted">
              Start from a template, connect one app and run it on your own
              data.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={APP_URL} className="btn btn-primary">
                Get started
              </a>
              <a href="#templates" className="btn border border-night-line text-night-ink hover:border-night-muted">
                Browse templates
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
