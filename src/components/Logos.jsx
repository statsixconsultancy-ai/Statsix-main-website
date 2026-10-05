// Placeholder client logomarks. Swap for real SVG logos when you have permission to use them.
const marks = {
  harbourline: {
    bg: '#2e6bff',
    svg: (
      <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
        <path d="M6 13c2.5-2 5-2 7.5 0s5 2 7.5 0" />
        <path d="M6 18c2.5-2 5-2 7.5 0s5 2 7.5 0" opacity=".7" />
        <path d="M13.5 5v6M10.5 8h6" />
      </g>
    ),
  },
  verdant: {
    bg: '#12b886',
    svg: (
      <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20c0-8 5-13 14-13 0 9-5 13-11 13H7z" />
        <path d="M7 20l8-8" />
      </g>
    ),
  },
  monarch: {
    bg: '#22332a',
    svg: (
      <text x="13.5" y="18.5" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="14" fill="#efe6d2">
        M&amp;R
      </text>
    ),
  },
  kiln: {
    bg: '#ff6a3d',
    svg: (
      <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M7 21V12a6.5 6.5 0 0 1 13 0v9z" />
        <path d="M13.5 18c-1.6 0-2.5-1-2.5-2.3 0-1.8 2.5-3.2 2.5-3.2s2.5 1.4 2.5 3.2c0 1.3-.9 2.3-2.5 2.3z" fill="#fff" />
      </g>
    ),
  },
  northpaw: {
    bg: '#ffc83d',
    svg: (
      <g fill="#131209">
        <ellipse cx="13.5" cy="17" rx="4.6" ry="3.8" />
        <circle cx="8" cy="11.5" r="1.9" />
        <circle cx="11.5" cy="8" r="1.9" />
        <circle cx="15.5" cy="8" r="1.9" />
        <circle cx="19" cy="11.5" r="1.9" />
      </g>
    ),
  },
  lumen: {
    bg: '#8b5cf6',
    svg: (
      <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
        <path d="M8 14a5.5 5.5 0 0 1 11 0" />
        <path d="M5 18h17M7 21.5h13" opacity=".75" />
      </g>
    ),
  },
}

export function BrandMark({ name, className = 'size-10 rounded-xl' }) {
  const m = marks[name]
  return (
    <span className={`grid shrink-0 place-items-center ${className}`} style={{ background: m.bg }} aria-hidden>
      <svg viewBox="0 0 27 27" className="size-[70%]">{m.svg}</svg>
    </span>
  )
}
