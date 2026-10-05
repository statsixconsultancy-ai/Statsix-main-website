// Services bento: a balanced 4 × 3 grid. Every tile runs its own little process.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import {
  SquaresFour, Robot, FlowArrow, Code, Trophy, MagnifyingGlass, CheckCircle, CircleNotch,
  EnvelopeSimple, Database, Package, Users, ChartLineUp, Receipt, Warehouse, FileText,
} from '@phosphor-icons/react'
import { Eyebrow, Reveal, SpotlightCard, Roll, ease } from './ui'

function useLoop(active, length, ms) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setI((v) => (v + 1) % length), ms)
    return () => clearInterval(t)
  }, [active, length, ms])
  return i
}

/* ---------- 1. BMS: every module beams into one core ---------- */
const modules = [
  { Icon: Users, label: 'CRM', color: '#2e6bff', x: 14, y: 20 },
  { Icon: Package, label: 'Inventory', color: '#2e6bff', x: 86, y: 20 },
  { Icon: Receipt, label: 'Billing', color: '#2e6bff', x: 8, y: 56 },
  { Icon: ChartLineUp, label: 'Reporting', color: '#2e6bff', x: 92, y: 56 },
  { Icon: Warehouse, label: 'ERP', color: '#2e6bff', x: 24, y: 88 },
  { Icon: FileText, label: 'HR', color: '#2e6bff', x: 76, y: 88 },
]

function BmsVisual({ active }) {
  const pulse = useLoop(active, modules.length, 900)
  return (
    <div className="relative h-full min-h-[280px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.map((m, i) => (
          <g key={m.label}>
            <line x1={m.x} y1={m.y} x2="50" y2="54" stroke="rgba(19,18,9,0.08)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <line
              x1={m.x} y1={m.y} x2="50" y2="54"
              stroke={m.color} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
              pathLength="100" strokeDasharray="14 86"
              className="beam-dash"
              style={{ animationDelay: `${i * -0.4}s`, opacity: active ? 1 : 0 }}
            />
          </g>
        ))}
      </svg>
      {modules.map((m, i) => (
        <motion.div
          key={m.label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-black/5 bg-white px-2.5 py-1.5 text-xs font-medium shadow-sm"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={active ? { opacity: 1, scale: pulse === i ? 1.08 : 1 } : {}}
          transition={{ duration: 0.6, ease, delay: active && pulse === 0 ? 0 : 0 }}
        >
          <m.Icon size={14} weight="duotone" style={{ color: m.color }} />
          {m.label}
        </motion.div>
      ))}
      <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -m-4 animate-ping rounded-3xl bg-blue/10" style={{ animationDuration: '2.4s' }} />
        <div className="relative grid size-20 place-items-center rounded-3xl bg-ink text-white shadow-[0_20px_40px_-12px_rgba(19,18,9,0.6)]">
          <SquaresFour size={30} weight="duotone" className="text-lime" />
        </div>
        <p className="mt-2 whitespace-nowrap text-center font-mono text-[11px] uppercase tracking-widest text-ink/50">One system</p>
      </div>
    </div>
  )
}

/* ---------- 2. AI agent: works a task step by step ---------- */
const agentSteps = [
  [EnvelopeSimple, 'Read email from Coastline Freight'],
  [FileText, 'Extracted PO-7714 · 14 line items'],
  [Database, 'Checked stock and pricing in ERP'],
  [Receipt, 'Drafted invoice and reply'],
]

function AgentVisual({ active }) {
  const step = useLoop(active, agentSteps.length + 2, 1300)
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {agentSteps.map(([Icon, t], i) => {
        const state = step > i ? 'done' : step === i ? 'run' : 'wait'
        return (
          <motion.div
            key={t}
            animate={{ opacity: state === 'wait' ? 0.4 : 1, x: state === 'run' ? 4 : 0 }}
            transition={{ duration: 0.5, ease }}
            className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs transition-colors duration-500 ${state === 'run' ? 'border-blue/30 bg-blue/5' : 'border-black/5 bg-white'}`}
          >
            <Icon size={14} className="shrink-0 text-ink/50" />
            <span className="truncate">{t}</span>
            <span className="ml-auto shrink-0">
              {state === 'done' && <CheckCircle size={16} weight="fill" className="text-mint" />}
              {state === 'run' && <CircleNotch size={16} className="animate-spin text-blue" />}
            </span>
          </motion.div>
        )
      })}
      <motion.div
        animate={{ opacity: step >= agentSteps.length ? 1 : 0.35 }}
        className="flex items-center justify-between rounded-xl bg-ink px-3 py-2 text-xs text-white"
      >
        <span>{step > agentSteps.length ? 'Approved by Priya' : 'Waiting for your approval'}</span>
        <span className={`rounded-md px-2 py-0.5 font-semibold ${step > agentSteps.length ? 'bg-mint' : 'bg-white/15'}`}>
          {step > agentSteps.length ? 'Sent' : 'Approve'}
        </span>
      </motion.div>
    </div>
  )
}

/* ---------- 3. Automation: documents ride a conveyor ---------- */
function AutomationVisual({ active }) {
  const [runs, setRuns] = useState(12408)
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setRuns((r) => r + 1 + Math.floor(Math.random() * 3)), 1100)
    return () => clearInterval(t)
  }, [active])
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="relative h-14 overflow-hidden rounded-xl border border-black/5 bg-black/[0.02]">
        <div className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-blue/10" />
        <span className="absolute left-1/2 top-1 -translate-x-1/2 font-mono text-[10px] text-blue">agent</span>
        {[0, 1, 2, 3].map((k) => (
          <span
            key={k}
            className="conveyor absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg border border-black/10 bg-white shadow-sm"
            style={{ animationDelay: `${k * -1}s` }}
          >
            <FileText size={14} className="conveyor-icon" />
          </span>
        ))}
      </div>
      <div>
        <p className="font-mono text-2xl font-medium"><Roll value={runs} /></p>
        <p className="text-xs text-ink/50">runs today · 0 errors</p>
      </div>
    </div>
  )
}

/* ---------- 4. Web software: code types, UI assembles ---------- */
const code = [
  ['const', ' order = ', 'await', ' db.orders.create({'],
  ['', '  customer, items,', '', ''],
  ['', '  status: ', '', "'confirmed'"],
  ['', '})', '', ''],
]

function SoftwareVisual({ active }) {
  const line = useLoop(active, code.length + 3, 900)
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="rounded-xl bg-ink p-3 font-mono text-[11px] leading-relaxed text-white/80">
        {code.map(([k, a, k2, s], i) => (
          <motion.div key={i} animate={{ opacity: line > i ? 1 : 0.15 }} transition={{ duration: 0.4 }}>
            <span className="text-violet-300">{k}</span>{a}<span className="text-violet-300">{k2}</span><span className="text-lime">{s}</span>
            {line === i + 1 && <span className="caret ml-0.5 text-lime" />}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {line >= code.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 rounded-xl border border-mint/30 bg-mint/5 px-3 py-2 text-xs"
          >
            <CheckCircle size={16} weight="fill" className="text-mint" /> Deployed v2.14 · tests passing
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- 5. Websites: score rings + live vitals ---------- */
function Ring({ value, label, color, active, delay }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-16">
        <svg viewBox="0 0 64 64" className="size-full -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(19,18,9,0.07)" strokeWidth="5" />
          <motion.circle
            cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={active ? { strokeDashoffset: c * (1 - value / 100) } : {}}
            transition={{ duration: 1.6, ease, delay }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-base font-semibold" style={{ color }}>
          {active ? value : 0}
        </span>
      </div>
      <span className="text-center text-[11px] leading-tight text-ink/50">{label}</span>
    </div>
  )
}

function WebsiteVisual({ active }) {
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <div className="flex justify-between gap-2">
        <Ring value={100} label="Performance" color="#12b886" active={active} delay={0} />
        <Ring value={98} label="Accessibility" color="#12b886" active={active} delay={0.15} />
        <Ring value={100} label="Best practice" color="#12b886" active={active} delay={0.3} />
        <Ring value={100} label="SEO" color="#12b886" active={active} delay={0.45} />
      </div>
      <div className="flex flex-wrap gap-2">
        {[['LCP', '0.8s'], ['CLS', '0.01'], ['INP', '64ms']].map(([k, v], i) => (
          <motion.span
            key={k}
            initial={{ opacity: 0, y: 8 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease, delay: 1 + i * 0.12 }}
            className="rounded-full border border-black/10 bg-white px-3 py-1 font-mono text-xs"
          >
            {k} <b className="text-mint">{v}</b>
          </motion.span>
        ))}
      </div>
    </div>
  )
}

/* ---------- 6. SEO, GEO, AEO: rank climbs, AI engines cite ---------- */
const engines = ['Google', 'ChatGPT', 'Perplexity', 'Gemini']

function SeoVisual({ active }) {
  const lit = useLoop(active, engines.length + 2, 900)
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="relative h-24">
        <svg viewBox="0 0 300 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <motion.path
            d="M0 80 C 40 78, 60 70, 90 64 S 140 52, 170 38 S 230 16, 300 8"
            fill="none" stroke="#2e6bff" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ duration: 2, ease }}
          />
        </svg>
        <span className="absolute bottom-0 left-0 rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-[11px] text-ink/50">#34</span>
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, ease, delay: 1.8 }}
          className="absolute -top-2 right-0 rounded-md bg-blue px-2 py-0.5 font-mono text-xs font-semibold text-white"
        >
          #2
        </motion.span>
      </div>
      <div className="flex flex-wrap gap-2">
        {engines.map((e, i) => (
          <span
            key={e}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all duration-700 ease-fluid ${lit > i ? 'bg-ink text-white' : 'bg-black/5 text-ink/55'}`}
          >
            {lit > i && <CheckCircle size={12} weight="fill" className="text-blue" />} {e}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Tile ---------- */
function Tile({ Icon, tone, title, body, Visual, className = '', layout = 'stack', tags }) {
  const ref = useRef(null)
  const active = useInView(ref, { amount: 0.4 })
  return (
    <div ref={ref} className={className}>
      <SpotlightCard className="h-full">
        <div className={`flex h-full gap-6 p-6 md:p-8 ${layout === 'row' ? 'flex-col sm:flex-row sm:items-stretch' : 'flex-col'}`}>
          <div className={`flex flex-col ${layout === 'row' ? 'sm:w-[42%] sm:shrink-0' : ''}`}>
            <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
              <Icon size={22} weight="duotone" />
            </span>
            <h3 className={`mt-5 font-semibold ${layout === 'big' ? 'text-3xl md:text-4xl' : 'text-xl'}`}>{title}</h3>
            <p className={`mt-2 text-ink/60 ${layout === 'big' ? 'max-w-md text-base' : 'text-sm'}`}>{body}</p>
            {tags && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((t) => <span key={t} className="rounded-full border border-black/10 px-2.5 py-0.5 font-mono text-[11px] text-ink/60">{t}</span>)}
              </div>
            )}
          </div>
          <div className="min-h-[180px] flex-1">
            <Visual active={active} />
          </div>
        </div>
      </SpotlightCard>
    </div>
  )
}

export default function Services() {
  return (
    <section id="services" className="px-4 py-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <Eyebrow tone={0}>What we build</Eyebrow>
          <h2 className="mt-6 text-4xl font-semibold md:text-6xl">
            End to end, under one roof
          </h2>
          <p className="mt-6 text-lg text-ink/60">
            Strategy, design, engineering and growth in a single team. Watch each part do its job.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-4">
          <Reveal className="md:col-span-2 md:row-span-2">
            <Tile
              className="h-full"
              layout="big"
              Icon={SquaresFour}
              tone="bg-black/[0.05] text-ink"
              title="STAT6 BMS · coming soon"
              body="Our own business management system: sales, operations, finance and AI agents in one place. Join the waitlist for early access."
              Visual={BmsVisual}
            />
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-2">
            <Tile
              className="h-full"
              layout="row"
              Icon={Robot}
              tone="bg-black/[0.05] text-ink"
              title="AI agents"
              body="Agents that read, decide and act inside your tools, with a human approval step where it matters."
              Visual={AgentVisual}
            />
          </Reveal>
          <Reveal delay={0.12}>
            <Tile className="h-full" Icon={FlowArrow} tone="bg-black/[0.05] text-ink" title="AI automation and integration" body="Connect your tools and let AI move the work between them." Visual={AutomationVisual} />
          </Reveal>
          <Reveal delay={0.18}>
            <Tile className="h-full" Icon={Code} tone="bg-black/[0.05] text-ink" title="Custom software" body="Portals, internal tools and SaaS, built around how you work." Visual={SoftwareVisual} />
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-2">
            <Tile
              className="h-full"
              layout="row"
              Icon={Trophy}
              tone="bg-black/[0.05] text-ink"
              title="Award grade websites"
              body="Design led sites with motion, built on a strict performance budget so they win attention and convert it."
              tags={['Brand', 'Motion', 'CMS', 'Core Web Vitals']}
              Visual={WebsiteVisual}
            />
          </Reveal>
          <Reveal delay={0.12} className="md:col-span-2">
            <Tile
              className="h-full"
              layout="row"
              Icon={MagnifyingGlass}
              tone="bg-black/[0.05] text-ink"
              title="SEO, GEO and AEO"
              body="Rank on Google and become the source that ChatGPT, Perplexity and AI Overviews cite."
              tags={['Technical SEO', 'Schema', 'Content', 'AI visibility']}
              Visual={SeoVisual}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
