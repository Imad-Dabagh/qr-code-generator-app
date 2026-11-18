export function QrBackground({ showCorners = true }: { showCorners?: boolean }) {
  return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#d4d4d8_1px,transparent_1px),linear-gradient(#d4d4d8_1px,transparent_1px)] bg-size-[32px_32px] opacity-50 mask-[radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />
        {showCorners && ['-left-8 -top-8 sm:left-8 sm:top-8', '-bottom-8 -right-8 rotate-180 sm:bottom-8 sm:right-8'].map((position) => (
          <svg
            key={position}
            viewBox="0 0 160 160"
            fill="none"
            className={`absolute size-36 text-zinc-400/60 sm:size-52 ${position}`}
          >
            <rect x="8" y="8" width="58" height="58" rx="10" stroke="currentColor" strokeWidth="7" />
            <rect x="24" y="24" width="26" height="26" rx="5" fill="currentColor" />
            <g fill="currentColor">
              <rect x="80" y="9" width="13" height="13" rx="3" />
              <rect x="101" y="9" width="13" height="13" rx="3" />
              <rect x="122" y="30" width="13" height="13" rx="3" />
              <rect x="80" y="51" width="13" height="13" rx="3" />
              <rect x="101" y="51" width="34" height="13" rx="3" />
              <rect x="9" y="80" width="13" height="13" rx="3" />
              <rect x="30" y="80" width="34" height="13" rx="3" />
              <rect x="51" y="101" width="13" height="13" rx="3" />
              <rect x="9" y="122" width="13" height="13" rx="3" />
              <rect x="51" y="122" width="13" height="13" rx="3" />
              <rect x="80" y="80" width="13" height="13" rx="3" />
              <rect x="101" y="101" width="13" height="13" rx="3" />
              <rect x="122" y="80" width="13" height="13" rx="3" />
              <rect x="80" y="122" width="13" height="13" rx="3" />
              <rect x="122" y="122" width="13" height="13" rx="3" />
            </g>
          </svg>
        ))}
      </div>
  )
}
