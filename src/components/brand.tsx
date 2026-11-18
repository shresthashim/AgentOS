/** The AgentOS mark from the product: a route, a node and a signal ring. */
export function BrandMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M5 16h7.5L17 8" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 16H19" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="1.5 3" />
      <circle cx="5" cy="16" r="2.75" fill="currentColor" />
      <circle cx="17.6" cy="7" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-cobalt text-white">
        <BrandMark size={20} />
      </span>
      <span className="heading text-[1.2rem]">AgentOS</span>
    </span>
  );
}
