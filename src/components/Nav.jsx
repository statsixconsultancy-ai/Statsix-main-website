import { useEffect, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { useMotionValueEvent, useScroll } from 'motion/react'

const links = [
  ['Services', '#services'],
  ['Work', '#work'],
  ['Process', '#process'],
  ['FAQ', '#faq'],
]
const delays = ['delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-500']

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    // sections below the fold load lazily, so keep looking for them as they arrive
    const seen = new Set()
    const scan = () => links.forEach(([, h]) => {
      const el = document.querySelector(h)
      if (el && !seen.has(el)) { seen.add(el); obs.observe(el) }
    })
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.getElementById('main') || document.body, { childList: true })
    return () => { obs.disconnect(); mo.disconnect() }
  }, [])

  useEffect(() => {
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-fluid ${
        scrolled ? 'border-b border-black/[0.06] bg-paper/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className={`relative z-10 mx-auto flex max-w-[1400px] items-center gap-2 px-4 transition-all duration-700 ease-fluid md:px-8 ${scrolled ? 'h-16' : 'h-20'}`}
      >
        <a href="#top" aria-label="STAT6 home" className="mr-auto flex items-center">
          <img src="/stat6-logo.png" alt="STAT6" className="h-5 w-auto" />
        </a>
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                aria-current={active === href ? 'location' : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-700 ease-fluid ${
                  active === href ? 'bg-black/10 text-ink' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#waitlist"
          className="hidden items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition-colors duration-700 ease-fluid hover:text-ink lg:inline-flex"
        >
          BMS waitlist
        </a>
        <a
          href="#contact"
          className="hidden items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-blue active:scale-[0.98] sm:inline-flex"
        >
          Book a call <ArrowUpRight weight="bold" />
        </a>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative size-10 rounded-full bg-black/10 transition-all duration-700 ease-fluid hover:bg-black/20 md:hidden"
        >
          <span
            className={`absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 rounded bg-ink transition-all duration-700 ease-fluid ${
              open ? 'rotate-45' : '-translate-y-1'
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 rounded bg-ink transition-all duration-700 ease-fluid ${
              open ? '-rotate-45' : 'translate-y-1'
            }`}
          />
        </button>
      </nav>

      <div
        className={`fixed inset-0 bg-white/80 backdrop-blur-3xl transition-all duration-700 ease-fluid md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-8">
          {[...links, ['Book a call', '#contact']].map(([label, href], i) => (
            <li key={href} className="overflow-hidden">
              <a
                href={href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className={`block py-2 text-5xl font-semibold tracking-tight transition-all duration-700 ease-fluid ${delays[i]} ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                } ${href === '#contact' ? 'text-blue' : 'text-ink'}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
