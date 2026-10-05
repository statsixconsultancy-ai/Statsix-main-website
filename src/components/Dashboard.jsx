// The hero product shot: a live STAT6 operations console.
// Everything here moves on its own: range tabs morph the chart, a crosshair scans
// the data, KPIs tick, agents work through jobs and toasts pop in.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import {
  House, Package, Truck, ChartLineUp, Users, Gear, Robot, MagnifyingGlass, CheckCircle, Lightning,
} from '@phosphor-icons/react'
import { Roll, ease } from './ui'
import { LiveFeed } from './Mocks'

const W = 600
const H = 220

/* Catmull–Rom to cubic bezier, fixed command count so paths can morph */
function smooth(values) {
  const p = values.map((v, i) => [(i / (values.length - 1)) * W, H - 12 - v * (H - 36)])
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p2
    const c = [
      p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
    ].map((n) => n.toFixed(1))
    d += ` C${c[0]},${c[1]} ${c[2]},${c[3]} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}

const ranges = {
  '7D': { actual: [0.3, 0.34, 0.31, 0.42, 0.4, 0.52, 0.49, 0.58, 0.62, 0.6, 0.71, 0.78], forecast: [0.28, 0.31, 0.34, 0.37, 0.41, 0.44, 0.47, 0.5, 0.53, 0.56, 0.59, 0.62], base: 58000, span: 61000 },
  '30D': { actual: [0.18, 0.27, 0.36, 0.32, 0.45, 0.51, 0.46, 0.6, 0.67, 0.72, 0.69, 0.85], forecast: [0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.64, 0.68, 0.72], base: 214000, span: 236000 },
  '90D': { actual: [0.1, 0.17, 0.15, 0.29, 0.38, 0.35, 0.5, 0.56, 0.63, 0.7, 0.77, 0.91], forecast: [0.12, 0.18, 0.24, 0.3, 0.36, 0.42, 0.48, 0.54, 0.6, 0.66, 0.71, 0.76], base: 690000, span: 812000 },
}
const rangeKeys = Object.keys(ranges)

function sample(values, t) {
  const x = t * (values.length - 1)
  const i = Math.min(Math.floor(x), values.length - 2)
  return values[i] + (values[i + 1] - values[i]) * (x - i)
}

function useTicker(start, maxStep, ms, active) {
  const [v, setV] = useState(start)
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setV((x) => x + 1 + Math.floor(Math.random() * maxStep)), ms)
    return () => clearInterval(t)
  }, [active, maxStep, ms])
  return v
}

function Spark({ d, color, active, delay = 0 }) {
  return (
    <svg viewBox="0 0 80 24" className="h-5 w-16 overflow-visible">
      <motion.path
        d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease, delay }}
      />
      <motion.circle
        cx="80" cy={d.split(' ').pop().split(',')[1]} r="2.2" fill={color}
        initial={{ scale: 0 }} animate={active ? { scale: [0, 1.6, 1] } : {}} transition={{ duration: 0.6, delay: delay + 1.5 }}
      />
    </svg>
  )
}

function Kpi({ label, children, delta, tone, spark, active, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay }}
      className="group relative overflow-hidden rounded-lg border border-black/5 bg-white p-2.5 transition-colors duration-700 ease-fluid hover:bg-black/[0.03]"
    >
      <p className="truncate text-[10px] uppercase tracking-wider text-ink/50">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-base font-semibold tabular-nums leading-none">{children}</p>
        <Spark d={spark} color={tone} active={active} delay={delay + 0.3} />
      </div>
      <p className="mt-1 text-[10px]" style={{ color: tone }}>{delta}</p>
    </motion.div>
  )
}

const agents = [
  { name: 'Invoice reconciler', color: '#2e6bff', dur: 5.5 },
  { name: 'Carrier booking', color: '#12b886', dur: 7.2 },
  { name: 'Support drafts', color: '#8b5cf6', dur: 4.4 },
]

const toasts = [
  ['PO-7714 approved by Priya', '#2e6bff'],
  ['Cash forecast refreshed', '#12b886'],
  ['42 invoices reconciled', '#b45309'],
  ['Late shipment rerouted', '#8b5cf6'],
]

export function Dashboard() {
  const ref = useRef(null)
  const active = useInView(ref, { once: true, amount: 0.3 })

  const [range, setRange] = useState('30D')
  const data = useRef(ranges['30D'])
  data.current = ranges[range]
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setRange((r) => rangeKeys[(rangeKeys.indexOf(r) + 1) % rangeKeys.length]), 5200)
    return () => clearInterval(t)
  }, [active])

  // Crosshair scanning across the chart
  const scan = useMotionValue(0.15)
  useEffect(() => {
    if (!active) return
    const c = animate(scan, [0.08, 0.96, 0.08], { duration: 9, repeat: Infinity, ease: 'easeInOut' })
    return () => c.stop()
  }, [active, scan])
  const left = useTransform(scan, (t) => `${t * 100}%`)
  const top = useTransform(scan, (t) => `${((H - 12 - sample(data.current.actual, t) * (H - 36)) / H) * 100}%`)
  const label = useTransform(scan, (t) => {
    const d = data.current
    return '$' + Math.round(d.base + sample(d.actual, t) * d.span).toLocaleString('en-US')
  })

  const revenue = useTicker(418210, 380, 1800, active)
  const orders = useTicker(1093, 2, 2600, active)
  const hours = useTicker(2861, 1, 3400, active)

  const [hover, setHover] = useState(0)
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setHover((h) => (h + 1) % 7), 1600)
    return () => clearInterval(t)
  }, [active])

  const [toast, setToast] = useState(null)
  useEffect(() => {
    if (!active) return
    let n = 0
    const show = () => {
      setToast({ id: n, t: toasts[n++ % toasts.length] })
      setTimeout(() => setToast(null), 2600)
    }
    const first = setTimeout(show, 2200)
    const t = setInterval(show, 5600)
    return () => { clearTimeout(first); clearInterval(t) }
  }, [active])

  const { actual, forecast } = ranges[range]
  const nav = [[House, 'Overview'], [Package, 'Orders'], [Truck, 'Fulfilment'], [ChartLineUp, 'Finance'], [Robot, 'Agents'], [Users, 'Customers'], [Gear, 'Settings']]

  return (
    <div ref={ref} className="relative flex aspect-[16/10] overflow-hidden rounded-2xl bg-[#fbfaf7] text-ink ring-1 ring-black/5">
      {/* Sidebar */}
      <aside className="hidden w-[20%] shrink-0 flex-col border-r border-black/5 p-3 sm:flex">
        <div className="mb-4 flex items-center gap-2 px-2">
          <span className="grid size-5 place-items-center rounded-md bg-blue text-[10px] font-bold text-white">S6</span>
          <span className="truncate text-xs font-semibold">Operations</span>
        </div>
        <div className="relative flex flex-col gap-0.5">
          {nav.map(([Icon, l], i) => (
            <div key={l} className={`relative flex items-center gap-2 truncate rounded-md px-2 py-1.5 text-[11px] ${i === 0 ? 'font-medium text-ink' : 'text-ink/50'}`}>
              {i === 0 && <span className="absolute inset-0 rounded-md bg-black/[0.06]" />}
              {i === hover && i !== 0 && (
                <motion.span layoutId="dash-hover" className="absolute inset-0 rounded-md bg-black/[0.04]" transition={{ duration: 0.6, ease }} />
              )}
              <Icon size={12} weight={i === 0 ? 'fill' : 'regular'} className="relative" />
              <span className="relative">{l}</span>
              {l === 'Agents' && <span className="relative ml-auto rounded-full bg-blue/10 px-1.5 text-[9px] text-blue">6</span>}
            </div>
          ))}
        </div>
        <div className="mt-auto rounded-lg border border-black/5 bg-white p-2.5">
          <p className="text-[10px] text-ink/50">Automated this week</p>
          <p className="mt-1 text-sm font-semibold"><Roll value={hours} /> hrs</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div className="h-full rounded-full bg-blue" initial={{ width: '0%' }} animate={active ? { width: '72%' } : {}} transition={{ duration: 2, ease, delay: 0.6 }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-ink/50">Monday, 5 October</p>
            <p className="truncate text-sm font-semibold">Good morning, Priya</p>
          </div>
          <div className="ml-auto hidden items-center gap-2 rounded-md border border-black/10 px-2 py-1 text-[10px] text-ink/50 md:flex">
            <MagnifyingGlass size={10} /> Ask your business anything
            <kbd className="rounded bg-black/[0.06] px-1 text-[9px]">⌘K</kbd>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-mint/10 px-2 py-1 text-[10px] text-mint">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue opacity-70" />
              <span className="relative size-1.5 rounded-full bg-blue" />
            </span>
            6 agents running
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Kpi label="Revenue MTD" delta="+12.7% vs Sept" tone="#2e6bff" active={active} delay={0.1} spark="M0 20 C 10 18, 18 14, 28 15 S 46 8, 56 9 S 72 3, 80 2">
            $<Roll value={revenue} />
          </Kpi>
          <Kpi label="Open orders" delta="214 ship today" tone="#7cc4ff" active={active} delay={0.2} spark="M0 14 C 10 18, 20 8, 30 12 S 50 16, 60 8 S 74 10, 80 6">
            <Roll value={orders} />
          </Kpi>
          <Kpi label="Cash runway" delta="Updated 06:00" tone="#ffc83d" active={active} delay={0.3} spark="M0 18 C 14 17, 24 15, 36 13 S 60 9, 80 7">
            19.4 mo
          </Kpi>
          <Kpi label="Hours automated" delta="+318 this week" tone="#ff9ac6" active={active} delay={0.4} spark="M0 22 C 12 20, 22 18, 32 14 S 54 10, 64 6 S 76 3, 80 2">
            <Roll value={hours} />
          </Kpi>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 md:grid-cols-3">
          {/* Chart */}
          <div className="relative flex min-h-0 flex-col overflow-hidden rounded-lg border border-black/5 bg-white p-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-ink/50">Revenue vs forecast</p>
                <p className="text-sm font-semibold">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={range} className="inline-block" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }}>
                      ${Math.round((ranges[range].base + ranges[range].span * 0.8) / 1000).toLocaleString('en-US')}k
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>
              <div className="relative flex rounded-md bg-black/[0.04] p-0.5 text-[10px]">
                {rangeKeys.map((k) => (
                  <button key={k} type="button" tabIndex={-1} onClick={() => setRange(k)} className={`relative rounded px-2 py-0.5 ${k === range ? 'text-white' : 'text-ink/55'}`}>
                    {k === range && <motion.span layoutId="dash-range" className="absolute inset-0 rounded bg-blue" transition={{ duration: 0.5, ease }} />}
                    <span className="relative">{k}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="relative mt-2 min-h-0 flex-1">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                {[0.25, 0.5, 0.75].map((g) => (
                  <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(19,18,9,0.06)" vectorEffect="non-scaling-stroke" />
                ))}
                <defs>
                  <linearGradient id="dash-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2e6bff" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#2e6bff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  animate={{ d: smooth(actual) + ` L${W},${H} L0,${H} Z` }}
                  transition={{ duration: 1.1, ease }}
                  fill="url(#dash-fill)"
                />
                <motion.path
                  animate={{ d: smooth(forecast) }}
                  transition={{ duration: 1.1, ease }}
                  fill="none" stroke="rgba(19,18,9,0.3)" strokeWidth="1.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ d: smooth(actual), pathLength: active ? 1 : 0 }}
                  transition={{ d: { duration: 1.1, ease }, pathLength: { duration: 2, ease, delay: 0.4 } }}
                  fill="none" stroke="#2e6bff" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* Crosshair */}
              <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 w-px bg-white/15" />
              <motion.div style={{ left, top }} className="pointer-events-none absolute">
                <span className="absolute -left-1.5 -top-1.5 size-3 rounded-full border-2 border-white bg-blue shadow-[0_0_12px_rgba(46,107,255,0.6)]" />
                <motion.span className="absolute -top-8 left-2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-lg">
                  {label}
                </motion.span>
              </motion.div>
            </div>
          </div>

          {/* Agents + feed */}
          <div className="hidden min-h-0 flex-col gap-2 md:flex">
            <div className="rounded-lg border border-black/5 bg-white p-3">
              <p className="mb-2 text-[11px] text-ink/50">Agents at work</p>
              <div className="space-y-2">
                {agents.map((a, i) => (
                  <div key={a.name}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5 text-ink/70">
                        <Robot size={10} weight="fill" style={{ color: a.color }} /> {a.name}
                      </span>
                      <span className="text-ink/50">running</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/[0.06]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: a.color }}
                        initial={{ width: '0%' }}
                        animate={active ? { width: ['0%', '100%'] } : {}}
                        transition={{ duration: a.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6, repeatDelay: 0.4 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-black/5 bg-white p-3">
              <p className="mb-2 flex items-center gap-1 text-[11px] text-ink/50"><Lightning size={10} weight="fill" className="text-blue" /> Live activity</p>
              <LiveFeed />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.5, ease }}
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-black/10 bg-white py-1.5 pl-2 pr-3 text-[11px] shadow-2xl backdrop-blur"
          >
            <CheckCircle size={14} weight="fill" style={{ color: toast.t[1] }} />
            {toast.t[0]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
