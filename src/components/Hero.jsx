import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import {
  ArrowUpRight, ArrowRight, EnvelopeSimple, Robot, Database, UsersThree, Receipt, CheckCircle, CircleNotch,
  Star, Lightning, ShieldCheck, WarningCircle,
} from '@phosphor-icons/react'
import { Magnet, Eyebrow, ease } from './ui'
import { Dashboard } from './Dashboard'

/* =====================================================================
   Build canvas: one real workflow STAT6 ships, running live.
   email arrives → AI agent extracts → integrations check → custom app updates
   ===================================================================== */

// step timeline (one tick ≈ 1.1s)
// 0 email in · 1 → agent · 2-4 agent extracts · 5 → systems · 6-8 checks · 9 → app · 10-12 row lands
const TICKS = 14
const fields = [
  ['Customer', 'Coastline Freight'],
  ['PO number', '7714'],
  ['Line items', '14'],
  ['Total', '$4,212.80'],
]
const systems = [
  [Database, 'ERP', 'Stock reserved'],
  [UsersThree, 'CRM', 'Account matched'],
  [Receipt, 'Accounting', 'Invoice drafted'],
]
const pastRows = [
  ['Northpaw', '$1,940.00'],
  ['Lumen Rail', '$12,380.50'],
  ['Okoro Foods', '$3,105.20'],
]

function Node({ on, done, className, label, Icon, tone, children }) {
  return (
    <div
      className={`relative rounded-2xl border bg-white p-3 sm:absolute transition-all duration-700 ease-fluid ${className} ${
        on ? 'border-ink/20 shadow-[0_18px_40px_-18px_rgba(19,18,9,0.35)]' : 'border-black/[0.07] shadow-[0_1px_0_rgba(19,18,9,0.04)]'
      }`}
    >
      <div className="flex items-center gap-2 text-[11px] font-medium text-ink/55">
        <span className={`grid size-6 place-items-center rounded-lg ${tone}`}><Icon size={13} weight="fill" /></span>
        {label}
        <span className="ml-auto">
          {on && !done && <CircleNotch size={14} className="animate-spin text-ink/55" />}
          {done && <CheckCircle size={14} weight="fill" className="text-mint" />}
        </span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function Wire({ d, live, color }) {
  return (
    <>
      <path d={d} fill="none" stroke="rgba(19,18,9,0.12)" strokeWidth="1.5" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      <motion.path
        d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ pathLength: live ? 1 : 0, opacity: live ? 1 : 0 }}
        transition={{ duration: live ? 0.9 : 0.3, ease }}
      />
    </>
  )
}

function BuildCanvas() {
  const [t, setT] = useState(0)
  const [run, setRun] = useState(12408)
  useEffect(() => {
    const id = setInterval(() => {
      setT((v) => {
        if (v + 1 >= TICKS) { setRun((r) => r + 1); return 0 }
        return v + 1
      })
    }, 1100)
    return () => clearInterval(id)
  }, [])

  const extracted = Math.max(0, Math.min(fields.length, (t - 1) * 1.4))
  const checks = Math.max(0, Math.min(systems.length, t - 5))
  const landed = t >= 10

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_40px_80px_-40px_rgba(19,18,9,0.35)]">
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-black/10" /><span className="size-2.5 rounded-full bg-black/10" /><span className="size-2.5 rounded-full bg-black/10" />
          </span>
          <span className="font-mono text-xs text-ink/50">order-intake.workflow</span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-mint/10 px-2 py-0.5 text-[11px] font-medium text-mint">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-60" />
              <span className="relative size-1.5 rounded-full bg-mint" />
            </span>
            Live in production
          </span>
        </div>

        {/* canvas */}
        <div
          className="relative flex flex-col gap-3 p-3 sm:block sm:aspect-[16/10] sm:p-0"
          style={{ backgroundImage: 'radial-gradient(rgba(19,18,9,0.09) 1px, transparent 1px)', backgroundSize: '18px 18px', backgroundColor: '#fbfaf7' }}
        >
          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Wire d="M45 17 C 50 17, 50 17, 54 17" live={t >= 1} color="#2e6bff" />
            <Wire d="M76 50 C 76 52, 76 53, 76 55" live={t >= 5} color="#2e6bff" />
            <Wire d="M54 72 C 51 72, 51 70, 47 70" live={t >= 9} color="#2e6bff" />
          </svg>

          {/* 1. trigger */}
          <Node on={t >= 0} done={t >= 1} className="sm:left-[3%] sm:top-[5%] sm:w-[42%]" label="Trigger · new email" Icon={EnvelopeSimple} tone="bg-blue/10 text-blue">
            <p className="truncate text-xs font-semibold">PO-7714 from Coastline Freight</p>
            <p className="mt-0.5 truncate text-[11px] text-ink/55">orders@coastlinefreight.com · 2 attachments</p>
          </Node>

          {/* 2. AI agent */}
          <Node on={t >= 1} done={t >= 5} className="sm:left-[54%] sm:top-[5%] sm:w-[43%]" label="AI agent · read and extract" Icon={Robot} tone="bg-blue/10 text-blue">
            <div className="space-y-1">
              {fields.map(([k, v], i) => (
                <div key={k} className="flex items-center justify-between gap-2 rounded-md bg-black/[0.03] px-2 py-1 text-[11px]">
                  <span className="text-ink/55">{k}</span>
                  {extracted > i ? (
                    <motion.span key={`v-${run}`} className="font-mono font-medium" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease }}>{v}</motion.span>
                  ) : (
                    <span className="h-2 w-12 rounded bg-black/10" />
                  )}
                </div>
              ))}
            </div>
          </Node>

          {/* 3. integrations */}
          <Node on={t >= 5} done={t >= 9} className="sm:left-[54%] sm:top-[55%] sm:w-[43%]" label="Integrations" Icon={Lightning} tone="bg-blue/10 text-blue">
            <div className="space-y-1">
              {systems.map(([Icon, name, result], i) => (
                <div key={name} className={`flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition-colors duration-500 ${checks > i ? 'bg-mint/10' : 'bg-black/[0.03]'}`}>
                  <Icon size={12} className="text-ink/50" />
                  <span className="font-medium">{name}</span>
                  <span className="ml-auto text-ink/50">{checks > i ? result : '…'}</span>
                </div>
              ))}
            </div>
          </Node>

          {/* 4. the client's custom app */}
          <Node on={t >= 9} done={landed} className="sm:left-[3%] sm:top-[44%] sm:w-[44%]" label="Your app · Orders" Icon={ShieldCheck} tone="bg-blue text-white">
            <div className="overflow-hidden rounded-lg border border-black/[0.06]">
              <AnimatePresence initial={false}>
                {landed && (
                  <motion.div
                    key={`row-${run}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 bg-blue/10 px-2 py-1.5 text-[11px]">
                      <span className="font-semibold">Coastline Freight</span>
                      <span className="ml-auto font-mono">$4,212.80</span>
                      <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">Ready</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {pastRows.map(([n, v]) => (
                <div key={n} className="flex items-center gap-2 border-t border-black/[0.05] px-2 py-1.5 text-[11px] text-ink/60">
                  <span>{n}</span>
                  <span className="ml-auto font-mono">{v}</span>
                  <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px]">Shipped</span>
                </div>
              ))}
            </div>
          </Node>
        </div>

        {/* status bar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-black/[0.06] px-4 py-2.5 font-mono text-[11px] text-ink/50">
          <span>Run <span className="text-ink">#{run.toLocaleString('en-US')}</span></span>
          <span>2.4s end to end</span>
          <span>0 errors</span>
          <span className="ml-auto hidden sm:inline">Human approval over $10k</span>
        </div>
      </div>

      {/* what used to happen */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 1.4 }}
        className="absolute -bottom-16 left-6 hidden rounded-2xl border border-black/[0.07] bg-white px-4 py-3 shadow-[0_20px_40px_-20px_rgba(19,18,9,0.35)] md:block"
      >
        <p className="text-[11px] text-ink/55">Before STAT6</p>
        <p className="text-sm"><span className="font-semibold">22 minutes</span> of copy and paste per order</p>
      </motion.div>
    </div>
  )
}

/* ============================== Hero ============================== */

// Placeholder portraits (randomuser.me). Replace with real client photos, used with permission.
export const faces = [
  ['https://randomuser.me/api/portraits/women/44.jpg', 'Priya Raman'],
  ['https://randomuser.me/api/portraits/men/32.jpg', 'Tomás Ferreira'],
  ['https://randomuser.me/api/portraits/women/68.jpg', 'Amara Okafor'],
  ['https://randomuser.me/api/portraits/men/75.jpg', 'Daniel Cho'],
  ['https://randomuser.me/api/portraits/women/65.jpg', 'Lena Hoffmann'],
]

const offer = [
  ['Custom software', 'bg-ink/30'],
  ['AI agents', 'bg-ink/30'],
  ['AI automation', 'bg-ink/30'],
  ['AI integration', 'bg-ink/30'],
  ['Websites', 'bg-ink/30'],
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 md:pt-32 lg:pb-28">
      {/* Background: editorial column guides + a flat stage behind the canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-4 px-4 md:px-8">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-full border-l border-black/[0.05] last:border-r"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ transformOrigin: 'top' }}
              transition={{ duration: 1.6, ease, delay: i * 0.08 }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] items-start gap-12 px-4 md:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <motion.a
            href="#waitlist"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white py-1 pl-1 pr-3 text-sm text-ink/70 transition-all duration-700 ease-fluid hover:border-black/20"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-paper px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-ink"><span className="size-1.5 rounded-full bg-mint" />STAT6 BMS</span>
            <span className="whitespace-nowrap"><span className="hidden sm:inline">Launching soon · </span>Join the waitlist</span>
            <ArrowRight size={14} className="transition-transform duration-700 ease-fluid group-hover:translate-x-1" />
          </motion.a>

          <h1 className="mt-8 font-display text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl xl:text-6xl">
            {[
              ['Custom software and AI agents'],
              ['that ', <span key="x" className="font-serif text-[1.12em] text-blue">10×</span>, ' your revenue'],
              ['in ', <span key="t" className="font-serif text-[1.12em]">less time.</span>],
            ].map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease, delay: 0.1 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-[520px] text-lg text-ink/65"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.4 }}
          >
            STAT6 is a software studio. We design and build the custom software your business runs on, then connect AI
            agents, automation and integrations so the busywork runs itself. And we build the website that brings the
            customers in.
          </motion.p>

          <motion.ul
            className="mt-6 flex flex-wrap gap-2"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.55 } } }}
          >
            {offer.map(([label, dot]) => (
              <motion.li
                key={label}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
                className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm"
              >
                <span className={`size-1.5 rounded-full ${dot}`} /> {label}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
          >
            <Magnet>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-base font-semibold text-white transition-all duration-700 ease-fluid hover:scale-[1.03] active:scale-[0.98]"
              >
                Book a strategy call
                <span className="grid size-9 place-items-center rounded-full bg-white text-ink transition-transform duration-700 ease-fluid group-hover:rotate-45">
                  <ArrowUpRight weight="bold" size={16} />
                </span>
              </a>
            </Magnet>
            <a href="#work" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-base font-semibold text-ink/70 transition-all duration-700 ease-fluid hover:bg-black/5 hover:text-ink">
              See our work
            </a>
          </motion.div>
          <motion.p
            className="mt-4 text-sm text-ink/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 0.85 }}
          >
            Best fit: teams of 10 to 500 people. Projects from $38k, fixed price.
          </motion.p>

          <motion.div
            className="mt-12 flex items-center gap-4 border-t border-black/10 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.9 }}
          >
            <div className="flex -space-x-2">
              {faces.map(([src, name]) => (
                <img key={name} src={src} alt={name} loading="lazy" className="relative size-10 rounded-full object-cover ring-[3px] ring-paper transition-transform duration-700 ease-fluid hover:z-10 hover:-translate-y-1" />
              ))}
            </div>
            <div className="text-sm leading-tight">
              <p className="flex items-center gap-1 font-semibold">
                4.9 <span className="flex text-sun">{[0, 1, 2, 3, 4].map((i) => <Star key={i} weight="fill" size={12} />)}</span>
              </p>
              <p className="text-ink/50">from 43 founders and operators</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="lg:col-span-7 lg:pt-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        >
          <BuildCanvas />
        </motion.div>
      </div>
    </section>
  )
}

/* ================= STAT6 BMS: first look + waitlist ================= */

function WaitlistForm() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const onSubmit = async (e) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email') || ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('Enter a valid work email, like priya@company.com.')
      return
    }
    setError('')
    setStatus('loading')
    // TODO: send to your waitlist provider. Simulated for now.
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('done')
  }
  if (status === 'done') {
    return (
      <p className="flex items-center justify-center gap-2 rounded-full bg-mint/10 px-5 py-3 text-sm font-medium text-mint">
        <CheckCircle weight="fill" size={18} /> You are on the list. We will email you before launch.
      </p>
    )
  }
  return (
    <form noValidate onSubmit={onSubmit} className="mx-auto w-full max-w-md">
      <div className={`flex items-center gap-2 rounded-full border bg-white p-1.5 pl-5 transition-colors duration-700 ease-fluid focus-within:border-ink/40 ${error ? 'border-red-400' : 'border-black/10'}`}>
        <label htmlFor="waitlist-email" className="sr-only">Work email</label>
        <input id="waitlist-email" name="email" type="email" placeholder="you@company.com" aria-invalid={!!error} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink/30" />
        <button type="submit" disabled={status === 'loading'} className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-blue active:scale-[0.98] disabled:opacity-70">
          {status === 'loading' ? 'Joining…' : 'Join the waitlist'}
        </button>
      </div>
      {error && <p className="mt-2 flex items-center justify-center gap-1 text-sm text-red-500"><WarningCircle /> {error}</p>}
    </form>
  )
}

export function ProductReveal() {
  const dash = useRef(null)
  const { scrollYProgress: dp } = useScroll({ target: dash, offset: ['start end', 'start 0.2'] })
  const tilt = useTransform(dp, [0, 1], [30, 0])
  const scale = useTransform(dp, [0, 1], [0.86, 1])
  const { scrollYProgress: sp } = useScroll({ target: dash, offset: ['start end', 'end start'] })
  const popA = useTransform(sp, [0, 1], [120, -120])
  const popB = useTransform(sp, [0, 1], [200, -200])

  return (
    <section id="waitlist" aria-label="STAT6 BMS" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow tone={5}>Coming soon</Eyebrow>
        <h2 className="mt-6 text-4xl font-semibold md:text-6xl">
          A first look at <span className="font-serif text-blue">STAT6 BMS</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink/60">
          Everything we have learned building custom systems, packaged into one business management system. Sales,
          operations, finance and AI agents in one place. Early access opens to the waitlist first.
        </p>
        <div className="mt-8"><WaitlistForm /></div>
        <p className="mt-3 text-xs text-ink/55">Founding customers get onboarding by our engineers. No spam.</p>
      </div>

      <div ref={dash} className="relative mx-auto mt-20 max-w-5xl" style={{ perspective: 1600 }}>
        <motion.div style={{ rotateX: tilt, scale, transformOrigin: 'center top' }} className="relative">
          <div className="rounded-3xl border border-black/10 bg-white p-2 shadow-[0_50px_100px_-30px_rgba(19,18,9,0.3)]">
            <Dashboard />
          </div>
          <span className="absolute -top-3 left-6 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white shadow-sm">Preview build</span>
        </motion.div>

        <motion.div style={{ y: popA }} className="absolute -left-16 top-[22%] z-20 hidden w-56 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_30px_60px_-20px_rgba(19,18,9,0.35)] lg:block">
          <p className="flex items-center gap-2 text-xs text-ink/50"><span className="size-2 rounded-full bg-blue" /> Cash runway</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">19.4 mo</p>
          <div className="mt-3 flex h-8 items-end gap-1">
            {[30, 42, 38, 55, 61, 58, 72, 80].map((h, i) => (
              <motion.span key={i} className="flex-1 rounded-sm bg-blue/80" initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: i * 0.06 }} />
            ))}
          </div>
        </motion.div>
        <motion.div style={{ y: popB }} className="absolute -right-14 top-[48%] z-20 hidden w-64 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_30px_60px_-20px_rgba(19,18,9,0.35)] lg:block">
          <p className="flex items-center gap-2 text-xs text-ink/50"><Robot size={14} weight="fill" className="text-blue" /> Agent asked for approval</p>
          <p className="mt-2 text-sm font-medium">Pay Coastline Freight $4,212.80?</p>
          <div className="mt-3 flex gap-2">
            <span className="flex-1 rounded-lg bg-ink py-1.5 text-center text-xs font-semibold text-white">Approve</span>
            <span className="flex-1 rounded-lg border border-black/10 py-1.5 text-center text-xs">Review</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
