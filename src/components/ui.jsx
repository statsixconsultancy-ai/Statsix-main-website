// Reusable motion primitives, modelled on ReactBits / Watermelon UI patterns
// (SplitText, SpotlightCard, TiltedCard, CountUp, ScrollVelocity, Magnet).
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  animate,
} from 'motion/react'

export const ease = [0.32, 0.72, 0, 1]

/* Heavy fade up on enter: translate-y-16 blur-md opacity-0 → resting */
export function Reveal({ children, delay = 0, className = '', as = 'div', amount = 0.3 }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 64, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Comp>
  )
}

/* ReactBits SplitText: words rise out of a mask, staggered */
export function SplitText({ lines, className = '', delay = 0, stagger = 0.06, accents = {} }) {
  let i = 0
  return (
    <span className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((word, wi) => {
            const d = delay + i++ * stagger
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className={`inline-block ${accents[word] || 'text-hero'}`}
                  initial={{ y: '110%', rotate: 4 }}
                  animate={{ y: '0%', rotate: 0 }}
                  transition={{ duration: 1.1, ease, delay: d }}
                >
                  {word}
                  {wi < line.split(' ').length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </span>
  )
}

/* ReactBits SpotlightCard: a soft light follows the pointer */
export function SpotlightCard({ children, className = '', color = 'rgba(46,107,255,0.10)' }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-3xl border border-black/10 bg-white transition-all duration-700 ease-fluid hover:border-black/20 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-fluid group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--x) var(--y), ${color}, transparent 60%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

/* ReactBits TiltedCard: perspective tilt toward the pointer */
export function Tilt({ children, className = '', max = 8 }) {
  const rx = useSpring(0, { stiffness: 140, damping: 18 })
  const ry = useSpring(0, { stiffness: 140, damping: 18 })
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
  }
  const reset = () => { rx.set(0); ry.set(0) }
  return (
    <div className={className} style={{ perspective: 1400 }} onMouseMove={onMove} onMouseLeave={reset}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="h-full">
        {children}
      </motion.div>
    </div>
  )
}

/* ReactBits CountUp */
export function CountUp({ to, decimals = 0, prefix = '', suffix = '', duration = 2.2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration, ease, onUpdate: setVal })
    return () => c.stop()
  }, [inView, to, duration])
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

const wrap = (min, max, v) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/* ReactBits ScrollVelocity: a marquee that speeds up and flips with scroll */
export function VelocityText({ children, baseVelocity = 2, className = '' }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)
  const dir = useRef(1)
  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000)
    if (factor.get() < 0) dir.current = -1
    else if (factor.get() > 0) dir.current = 1
    move += dir.current * move * factor.get()
    baseX.set(baseX.get() + move)
  })
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className={`flex w-max ${className}`} style={{ x }}>
        {[0, 1, 2, 3].map((k) => (
          <span key={k} aria-hidden={k > 0} className="block pr-12">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ReactBits Magnet: element leans toward the pointer */
export function Magnet({ children, strength = 0.25, className = '' }) {
  const x = useSpring(0, { stiffness: 200, damping: 16 })
  const y = useSpring(0, { stiffness: 200, damping: 16 })
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

const dots = ['bg-blue']
export function Eyebrow({ children, tone = 0 }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink/60">
      <span className={`size-2 rounded-full ${dots[tone % dots.length]}`} />
      {children}
    </p>
  )
}

export const btnPrimary =
  'inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-base font-semibold text-white transition-all duration-700 ease-fluid hover:bg-blue hover:scale-[1.03] active:scale-[0.98]'
export const btnGhost =
  'inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-3 text-base font-semibold text-ink transition-all duration-700 ease-fluid hover:bg-black/10 active:scale-[0.98]'

/* Odometer: each digit is a 0 to 9 strip that slides to its value */
function Digit({ d }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden leading-none">
      <span className="invisible">0</span>
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        animate={{ y: `${-d}em` }}
        transition={{ duration: 0.8, ease }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="block h-[1em] leading-none">{n}</span>
        ))}
      </motion.span>
    </span>
  )
}

export function Roll({ value, format = (n) => n.toLocaleString('en-US') }) {
  const text = format(value)
  const chars = text.split('')
  return (
    <span className="inline-flex items-baseline tabular-nums" aria-label={text}>
      {chars.map((ch, i) =>
        /d/.test(ch) ? (
          <Digit key={chars.length - i} d={+ch} />
        ) : (
          <span key={chars.length - i + 's'} aria-hidden>{ch}</span>
        ),
      )}
    </span>
  )
}

