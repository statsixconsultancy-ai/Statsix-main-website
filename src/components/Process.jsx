// How we work: a dark, pinned chapter that scrolls sideways through four steps,
// each with its own live visual. Followed by an editorial numbers band.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { Check, Robot, EnvelopeSimple, Database, Phone, ChatsCircle, UserPlus, ClipboardText } from '@phosphor-icons/react'
import { CountUp, Reveal, ease } from './ui'

/* ---------- step visuals ---------- */

const journey = [
  [Phone, 'Cold call', 'You call us, or we call you', '15 min'],
  [ChatsCircle, 'Discovery', 'Workshop with your team', 'Day 2'],
  [UserPlus, 'Onboarding', 'Access, data and kickoff', 'Day 5'],
  [ClipboardText, 'Setup complete', 'Blueprint and fixed quote', 'Day 10'],
]

function MapVisual({ on }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    const t = setInterval(() => setN((v) => (v + 1) % (journey.length + 2)), 1100)
    return () => clearInterval(t)
  }, [on])
  return (
    <div className="relative flex h-full flex-col justify-center">
      <div className="absolute bottom-8 left-[27px] top-8 w-px bg-black/10">
        <motion.div className="w-full origin-top bg-blue" animate={{ height: `${(Math.min(n, journey.length - 1) / (journey.length - 1)) * 100}%` }} transition={{ duration: 0.8, ease }} />
      </div>
      <ol className="relative space-y-3">
        {journey.map(([Icon, title, sub, when], i) => {
          const done = n > i
          const now = n === i
          return (
            <li key={title} className={`flex items-center gap-4 rounded-2xl border p-3 transition-all duration-500 ${now ? 'border-blue/40 bg-blue/5 shadow-sm' : done ? 'border-black/5 bg-white' : 'border-black/5 bg-white opacity-50'}`}>
              <span className={`relative grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-500 ${done ? 'bg-blue text-white' : now ? 'bg-white text-blue ring-2 ring-blue' : 'bg-black/5 text-ink/55'}`}>
                {done ? <Check size={14} weight="bold" /> : <Icon size={15} weight="fill" />}
                {now && <span className="absolute inset-0 animate-ping rounded-full ring-2 ring-blue/40" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block truncate text-xs text-ink/50">{sub}</span>
              </span>
              <span className="font-mono text-[11px] text-ink/55">{when}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function BuildVisual({ on }) {
  const releases = ['v0.1', 'v0.2', 'v0.3', 'v0.4', 'v0.5', 'v1.0']
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    const t = setInterval(() => setN((v) => (v + 1) % (releases.length + 2)), 800)
    return () => clearInterval(t)
  }, [on, releases.length])
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
        <motion.div className="h-full rounded-full bg-blue" animate={{ width: `${(Math.min(n, releases.length) / releases.length) * 100}%` }} transition={{ duration: 0.6, ease }} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {releases.map((r, i) => (
          <div
            key={r}
            className={`rounded-xl border p-3 transition-all duration-500 ${n > i ? 'border-blue/30 bg-blue/5' : 'border-black/10 bg-black/[0.02]'}`}
          >
            <p className="font-mono text-xs text-ink/50">Sprint {i + 1}</p>
            <p className="mt-1 flex items-center justify-between text-lg font-semibold">
              {r} {n > i && <Check size={16} weight="bold" className="text-blue" />}
            </p>
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-ink/50">Clickable demo every second Friday · no slide decks</p>
    </div>
  )
}

function AutomateVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-6">
      <div className="relative flex items-center justify-between">
        <div className="absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-black/15" />
        {[[EnvelopeSimple, 'Inbox'], [Robot, 'AI agent'], [Database, 'Your ERP']].map(([Icon, l], i) => (
          <div key={l} className="relative flex flex-col items-center gap-2">
            <span className={`grid size-16 place-items-center rounded-2xl ${i === 1 ? 'bg-blue text-white' : 'border border-black/10 bg-white text-ink'}`}>
              <Icon size={26} weight="duotone" />
            </span>
            <span className="text-xs text-ink/60">{l}</span>
          </div>
        ))}
        {[0, 1, 2].map((k) => (
          <span key={k} className="conveyor absolute top-[32px] size-2 -translate-y-1/2 rounded-full bg-blue shadow-[0_0_12px_2px_rgba(46,107,255,0.5)]" style={{ animationDelay: `${k * -1.33}s` }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        {[['2.4s', 'per order'], ['0', 'errors this week'], ['31.5h', 'saved weekly']].map(([v, l]) => (
          <div key={l} className="rounded-xl border border-black/10 py-3">
            <p className="text-xl font-semibold">{v}</p>
            <p className="text-[11px] text-ink/50">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function GrowVisual({ on }) {
  const tiles = [
    { label: 'Hours saved', to: 1284, unit: 'hrs', note: 'this quarter', tone: 'text-ink' },
    { label: 'Revenue automated', to: 2.41, decimals: 2, prefix: '$', unit: 'M', note: 'processed by agents', tone: 'text-ink' },
    { label: 'Orders handled', to: 18406, unit: '', note: 'with zero manual entry', tone: 'text-ink' },
    { label: 'Cost per order', to: 0.38, decimals: 2, prefix: '$', unit: '', note: 'down from $9.40', tone: 'text-ink' },
  ]
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }} animate={on ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease, delay: i * 0.12 }}
            className="rounded-xl border border-black/5 bg-paper p-3"
          >
            <p className="text-[11px] text-ink/50">{t.label}</p>
            <p className={`mt-1 font-display text-2xl font-medium tracking-tight ${t.tone}`}>
              {t.prefix}<CountUp to={on ? t.to : 0} decimals={t.decimals || 0} />{t.unit && <span className="ml-0.5 text-sm text-ink/55">{t.unit}</span>}
            </p>
            <p className="text-[11px] text-ink/55">{t.note}</p>
          </motion.div>
        ))}
      </div>
      <div className="relative min-h-[90px] flex-1 rounded-xl border border-black/5 bg-paper p-3">
        <p className="text-[11px] text-ink/50">Revenue vs headcount, 18 months</p>
        <svg viewBox="0 0 400 120" className="absolute inset-x-3 bottom-3 h-[70%] w-[calc(100%-24px)] overflow-visible" preserveAspectRatio="none">
          <motion.path d="M0 112 C 80 110, 140 100, 200 82 S 300 36, 400 6" fill="none" stroke="#2e6bff" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 2, ease, delay: 0.4 }} />
          <motion.path d="M0 100 C 100 99, 200 97, 400 92" fill="none" stroke="rgba(19,18,9,0.3)" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 2, ease, delay: 0.4 }} />
        </svg>
        <motion.span
          className="absolute right-3 top-3 rounded-full bg-blue px-2.5 py-1 text-xs font-semibold text-white"
          initial={{ opacity: 0, scale: 0.7 }} animate={on ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, ease, delay: 2.2 }}
        >
          10× revenue · same team
        </motion.span>
      </div>
    </div>
  )
}

const steps = [
  { n: '01', title: 'Map', time: 'Weeks 1 to 2', body: 'From the first call to a signed off setup in ten days. We meet your team, map every workflow and find where the hours and revenue leak.', get: ['Process blueprint', 'Fixed price quote', 'ROI estimate'], Visual: MapVisual },
  { n: '02', title: 'Build', time: 'Weeks 3 to 12', body: 'Your custom software ships in fortnightly releases you can click through and use, not slide decks.', get: ['Working releases', 'Your code and IP', 'Real data from day one'], Visual: BuildVisual },
  { n: '03', title: 'Automate', time: 'Alongside the build', body: 'AI agents and integrations take over the repetitive work, with human approval wherever money or patients are involved.', get: ['AI agents', 'Integrations', 'Audit logs'], Visual: AutomateVisual },
  { n: '04', title: 'Grow', time: 'Ongoing', body: 'A named engineer runs and improves the system as you scale, so revenue grows without the team growing at the same rate.', get: ['Uptime ownership', 'Monthly improvements', 'Growth reviews'], Visual: GrowVisual },
]

function StepCard({ s }) {
  const ref = useRef(null)
  const on = useInView(ref, { amount: 0.5 })
  const { Visual } = s
  return (
    <article ref={ref} className="grid shrink-0 gap-8 rounded-[32px] border border-black/10 bg-paper p-8 md:p-10 lg:h-[64vh] lg:w-[min(82vw,1040px)] lg:grid-cols-2">
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between">
          {s.n}
          <span className="font-mono text-xs uppercase tracking-widest text-ink/50">{s.time}</span>
        </div>
        <h3 className="mt-auto pt-8 text-5xl font-medium">{s.title}</h3>
        <p className="mt-4 max-w-md text-lg text-ink/60">{s.body}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {s.get.map((g) => (
            <li key={g} className="flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1 text-sm text-ink/80">
              <Check size={14} weight="bold" className="text-blue" /> {g}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-h-[260px] rounded-2xl border border-black/5 bg-white p-6">
        <Visual on={on} />
      </div>
    </article>
  )
}

export function Process() {
  const wrap = useRef(null)
  const track = useRef(null)
  const [distance, setDistance] = useState(0)
  const [desktop, setDesktop] = useState(false)

  useLayoutEffect(() => {
    const measure = () => {
      const d = window.matchMedia('(min-width: 1024px)').matches
      setDesktop(d)
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance])
  const bar = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])
  const counter = useTransform(scrollYProgress, (p) => `0${Math.min(4, Math.max(1, Math.ceil(((p - 0.05) / 0.9) * 4)))}`)

  return (
    <section id="process" ref={wrap} className="relative border-y border-black/[0.06] bg-white text-ink lg:h-[280vh]">
      <div className="flex flex-col gap-10 py-24 lg:sticky lg:top-0 lg:h-screen lg:justify-center lg:overflow-hidden lg:py-0">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink/60">
              <span className="size-2 rounded-full bg-blue" /> How we work
            </p>
            <h2 className="mt-6 max-w-3xl text-4xl font-medium md:text-6xl">
              From first call to 10× growth
            </h2>
          </div>
          <div className="hidden w-64 lg:block">
            <div className="flex justify-between font-mono text-xs text-ink/50">
              <span>Step <motion.span className="text-ink">{counter}</motion.span> / 04</span>
              <span>Scroll</span>
            </div>
            <div className="mt-2 h-px bg-black/15">
              <motion.div className="h-px origin-left bg-blue" style={{ scaleX: bar }} />
            </div>
          </div>
        </div>
        <motion.div
          ref={track}
          style={desktop ? { x } : undefined}
          className="flex flex-col gap-6 px-4 md:px-8 lg:w-max lg:flex-row lg:pl-[max(2rem,calc((100vw-1400px)/2+2rem))] lg:pr-[10vw]"
        >
          {steps.map((s) => <StepCard key={s.n} s={s} />)}
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- Numbers band ---------- */

const numbers = [
  { label: 'Clients', to: 43, unit: '', desc: 'businesses running on software we built' },
  { label: 'Automation', to: 1.9, decimals: 1, unit: 'M', desc: 'AI agent tasks completed every month' },
  { label: 'Speed', to: 11, unit: 'wks', desc: 'median from first workshop to production' },
  { label: 'Reliability', to: 99.94, decimals: 2, unit: '%', desc: 'platform uptime over the last 12 months' },
]

export function Stats() {
  return (
    <section className="px-4 py-28 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-xl text-3xl font-medium md:text-5xl">
            Numbers our clients actually track
          </h2>
          <p className="max-w-sm text-ink/55">Measured across every system we run in production, updated monthly.</p>
        </Reveal>
        <div className="mt-14 grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {numbers.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className={`border-b border-ink/15 py-8 sm:px-6 lg:border-b-0 ${i ? 'lg:border-l' : 'sm:pl-0'} ${i % 2 ? 'sm:border-l' : ''}`}>
              <p className="font-mono text-xs uppercase tracking-widest text-ink/55">0{i + 1} · {s.label}</p>
              <p className="mt-6 flex items-baseline gap-1 font-display text-7xl font-medium tracking-[-0.055em] text-ink">
                <CountUp to={s.to} decimals={s.decimals || 0} />
                <span className="text-3xl tracking-tight text-ink/55">{s.unit}</span>
              </p>
              <p className="mt-4 max-w-[220px] text-sm text-ink/55">{s.desc}</p>
              <motion.div
                className="mt-8 h-px origin-left bg-ink"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease, delay: 0.3 + i * 0.1 }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
