/**
 * Abstract, geometric "constellation" graphic for the Home hero — two node
 * clusters drifting toward a shared connection point. Purely decorative,
 * built from CSS-animated SVG so it stays crisp at any size and respects
 * prefers-reduced-motion via the global rule in index.css.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hv_line_a" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--vivid-violet)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--vivid-cyan)" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="hv_line_b" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="var(--vivid-cyan)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--vivid-violet)" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="hv_core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--vivid-cyan)" />
          <stop offset="100%" stopColor="var(--vivid-violet)" />
        </radialGradient>
      </defs>

      {/* connective lines converging on the shared node */}
      <g strokeWidth="1.5" opacity="0.8">
        <line x1="70" y1="90" x2="238" y2="182" stroke="url(#hv_line_a)" />
        <line x1="110" y1="230" x2="238" y2="182" stroke="url(#hv_line_a)" />
        <line x1="60" y1="180" x2="238" y2="182" stroke="url(#hv_line_a)" />
        <line x1="410" y1="80" x2="242" y2="178" stroke="url(#hv_line_b)" />
        <line x1="400" y1="250" x2="242" y2="178" stroke="url(#hv_line_b)" />
        <line x1="330" y1="300" x2="242" y2="178" stroke="url(#hv_line_b)" />
      </g>

      {/* left cluster — orbiting slowly */}
      <g style={{ transformOrigin: "70px 160px", animation: "orbit 40s linear infinite" }}>
        <circle cx="70" cy="90" r="6" fill="var(--vivid-violet)" opacity="0.85" />
        <circle cx="60" cy="180" r="4" fill="var(--vivid-violet)" opacity="0.6" />
        <circle cx="110" cy="230" r="5" fill="var(--vivid-violet)" opacity="0.7" />
      </g>

      {/* right cluster — orbiting the opposite way */}
      <g style={{ transformOrigin: "390px 190px", animation: "orbit 55s linear infinite reverse" }}>
        <circle cx="410" cy="80" r="5" fill="var(--vivid-cyan)" opacity="0.8" />
        <circle cx="400" cy="250" r="6" fill="var(--vivid-cyan)" opacity="0.7" />
        <circle cx="330" cy="300" r="4" fill="var(--vivid-cyan)" opacity="0.55" />
      </g>

      {/* the shared connection point */}
      <circle cx="240" cy="180" r="10" fill="url(#hv_core)" className="animate-float" />
      <circle
        cx="240"
        cy="180"
        r="22"
        fill="none"
        stroke="url(#hv_core)"
        strokeWidth="1"
        opacity="0.35"
        style={{ animation: "pulse-glow 3.2s ease-in-out infinite" }}
      />
    </svg>
  );
}
