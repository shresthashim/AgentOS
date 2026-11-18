/**
 * The opening moment: the AgentOS mark is itself a tiny workflow (a start node,
 * a route, a hand-off and an approval ring), so it draws itself in that order,
 * the name rises in, a wire fills as the page loads, and the screen lifts away.
 *
 * Plain server-rendered markup and CSS, so it appears on the very first paint,
 * before any JavaScript. A small inline script decides whether to show it (once
 * per session, never with reduced motion) and when to dismiss it. It only ever
 * toggles classes on <html>, so React hydration is never disturbed.
 */
const SCRIPT = `(() => {
  const root = document.documentElement;
  let seen = false;
  try { seen = sessionStorage.getItem("agentos.splash") === "1"; sessionStorage.setItem("agentos.splash", "1"); } catch (e) {}
  if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) { root.classList.add("splash-skip"); return; }
  root.classList.add("splash-on");
  const start = performance.now();
  const MIN = 1500, MAX = 4000;
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    root.classList.add("splash-loaded");
    setTimeout(() => { root.classList.add("splash-out"); root.classList.remove("splash-on"); }, 260);
    setTimeout(() => root.classList.add("splash-skip"), 1100);
  };
  const ready = () => setTimeout(finish, Math.max(0, MIN - (performance.now() - start)));
  if (document.readyState === "complete") ready(); else addEventListener("load", ready, { once: true });
  setTimeout(finish, MAX);
})();`;

const LETTERS = "AgentOS".split("");

export function Splash() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <noscript>
        <style>{".splash{display:none!important}"}</style>
      </noscript>
      <div className="splash" aria-hidden="true">
        <div className="splash-stage">
          <span className="splash-tile">
            <svg viewBox="0 0 24 24" className="splash-mark">
              {/* Route: start node → bend → approval ring. */}
              <path className="splash-route" d="M5 16h7.5L17 8" pathLength={1} />
              {/* Hand-off: the dashed line that keeps flowing. */}
              <path className="splash-handoff" d="M12.5 16H19" />
              <circle className="splash-node" cx="5" cy="16" r="2.75" />
              <circle className="splash-ring" cx="17.6" cy="7" r="2.6" pathLength={1} />
            </svg>
            <span className="splash-pulse" />
          </span>
          <span className="splash-name">
            {LETTERS.map((letter, i) => (
              <span key={i} style={{ animationDelay: `${0.62 + i * 0.045}s` }}>
                {letter}
              </span>
            ))}
          </span>
        </div>
        <span className="splash-wire">
          <span />
        </span>
      </div>
    </>
  );
}
