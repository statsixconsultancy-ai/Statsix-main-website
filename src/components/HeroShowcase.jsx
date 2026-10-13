// Hero showcase: one browser window, two live panels, built from STAT6's services.
// Left: what we build (custom app, AI agent, automation, integration, website) at readable sizes.
// Right: an AI agent handling a real request, typed live, with each step ticking off.
// Both panels stretch to fill the hero's height. Everything stays level: nothing tilts.
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  Lock, SquaresFour, Sparkle, LinkSimple, CheckCircle, EnvelopeSimple, Robot, Database, UsersThree, Receipt, PaperPlaneRight,
  CreditCard, Tray,
} from '@phosphor-icons/react'
import { Roll, ease } from './ui'

const TICKS = 16 // one tick = 0.9s, so the story loops about every 14s
const TICK_MS = 900

function useLoop() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % TICKS), TICK_MS)
    return () => clearInterval(id)
  }, [])
  return t
}

// highest tick reached so far: pieces appear once and then stay on screen
function useSeen(t) {
  const [max, setMax] = useState(0)
  useEffect(() => { setMax((m) => Math.max(m, t)) }, [t])
  return max
}

function useTyped(text, active, cps = 32) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) { setN(0); return }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) clearInterval(id)
    }, 1000 / cps)
    return () => clearInterval(id)
  }, [active, text, cps])
  return n
}

/* ---------------- helpers ---------------- */

const cardCls = 'rounded-2xl bg-white shadow-[0_22px_36px_-20px_rgba(29,31,44,0.3),0_0_0_1px_rgba(29,31,44,0.05)]'

function Reveal({ show, className = '', children }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.7, ease }}
    >
      {children}
    </motion.div>
  )
}

function Tag({ children, tone }) {
  return <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${tone}`}>{children}</span>
}

// handwritten note that sits on the top edge of a card
function Note({ show, color, className = 'right-4', children }) {
  return (
    <motion.p
      className={`absolute -top-[18px] z-10 bg-[#faf9f6] px-1.5 font-hand text-[21px] font-bold leading-none ${className}`}
      style={{ color }}
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.6, ease }}
    >
      {children}
    </motion.p>
  )
}

/* ---------------- the pieces ---------------- */

function SoftwareCard({ seen }) {
  return (
    <div className={`${cardCls} overflow-hidden`}>
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#f7f6f2] px-3.5 py-2">
        <span className="size-2 rounded-full bg-black/15" /><span className="size-2 rounded-full bg-black/15" /><span className="size-2 rounded-full bg-black/15" />
        <span className="ml-2 hidden rounded bg-white px-2 py-0.5 font-mono text-[10px] text-ink/50 ring-1 ring-black/5 sm:inline">your-business.app</span>
        <Tag tone="ml-auto bg-blue/30 text-bluedeep">Custom software</Tag>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-[18px] font-semibold tracking-tight">Orders</p>
          <span className="flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-1 text-[11px] font-semibold text-mintdeep"><span className="size-1.5 rounded-full bg-mintdeep" /> Live</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {[
            ['Revenue', seen >= 1 ? 418210 : 0, (n) => '$' + Math.round(n / 1000) + 'k'],
            ['Open orders', seen >= 1 ? 1093 : 0, (n) => n.toLocaleString('en-US')],
            ['On time', seen >= 1 ? 963 : 0, (n) => (n / 10).toFixed(1) + '%'],
          ].map(([l, v, f]) => (
            <div key={l} className="rounded-xl bg-black/[0.03] p-2.5">
              <p className="text-[10px] uppercase tracking-wider text-ink/55">{l}</p>
              <p className="mt-1 font-display text-[18px] font-semibold tabular-nums"><Roll value={v} format={f} /></p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 280 64" className="mt-3.5 h-[64px] w-full overflow-visible" preserveAspectRatio="none">
          <motion.path
            d="M0 52 C 30 48, 50 36, 80 38 S 130 22, 160 24 S 220 8, 280 4 L280 64 L0 64 Z"
            fill="rgba(156,195,247,0.25)" initial={false} animate={{ opacity: seen >= 2 ? 1 : 0 }} transition={{ duration: 0.8 }}
          />
          <motion.path
            d="M0 52 C 30 48, 50 36, 80 38 S 130 22, 160 24 S 220 8, 280 4"
            fill="none" stroke="#6aa5ee" strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            initial={false} animate={{ pathLength: seen >= 1 ? 1 : 0 }} transition={{ duration: 1.6, ease }}
          />
        </svg>
      </div>
    </div>
  )
}

const agentTasks = ['Reading the inbox', 'Matching PO-7714', 'Drafting the reply']

function AgentCard({ t }) {
  return (
    <div className={`${cardCls} h-full p-4`}>
      <div className="flex items-center justify-between gap-2">
        <Tag tone="bg-rose text-pinkdeep">AI agent</Tag>
        <span className="flex items-center gap-1.5 text-[11px] text-ink/55"><span className="pulse-dot size-1.5 rounded-full bg-mint" /> working</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <motion.span
          className="size-11 shrink-0 rounded-full"
          style={{ background: 'radial-gradient(circle at 30% 28%, #fff 0%, #fbcfe0 48%, #ec9bbd 100%)', boxShadow: '0 12px 20px -8px rgba(236,155,189,0.9)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="min-w-0 space-y-2">
          {agentTasks.map((a, i) => {
            const on = t >= 3 + i * 3
            return (
              <div key={a} className="flex items-center gap-2 text-[12px]">
                <span className={`grid size-4 shrink-0 place-items-center rounded-full transition-colors duration-500 ${on ? 'bg-mint' : 'bg-black/10'}`}>
                  {on && <CheckCircle size={11} weight="fill" className="text-white" />}
                </span>
                <span className={`truncate ${on ? 'text-ink' : 'text-ink/50'}`}>{a}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function IntegrationCard() {
  const sats = [[Database, 'ERP', 'bg-rose'], [UsersThree, 'CRM', 'bg-butter'], [Tray, 'Mail', 'bg-sky'], [CreditCard, 'Pay', 'bg-mintsoft']]
  return (
    <div className={`${cardCls} h-full p-4`}>
      <Tag tone="bg-mintsoft text-mintdeep">AI integration</Tag>
      <div className="relative mt-3 grid grid-cols-2 gap-x-14 gap-y-3 px-1">
        {sats.map(([Icon, l, bg]) => (
          <div key={l} className="flex flex-col items-center gap-1">
            <span className={`grid size-10 place-items-center rounded-xl ${bg} shadow-sm ring-1 ring-black/5`}><Icon size={18} className="text-ink/65" /></span>
            <span className="text-[11px] text-ink/60">{l}</span>
          </div>
        ))}
        <motion.span
          className="absolute left-1/2 top-[44%] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_10px_20px_-8px_rgba(29,31,44,0.4)] ring-1 ring-black/5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkle size={18} weight="fill" className="text-mintdeep" />
        </motion.span>
      </div>
    </div>
  )
}

function AutomationCard() {
  const nodes = [[EnvelopeSimple, 'Inbox'], [Robot, 'Agent'], [Database, 'ERP'], [Receipt, 'Invoice']]
  return (
    <div className={`${cardCls} p-4`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tag tone="bg-lavender text-violetdeep">AI automation</Tag>
        <span className="font-mono text-[11px] text-ink/55">12,408 runs · 0 errors</span>
      </div>
      <div className="relative mt-4 flex items-start justify-between px-2">
        <div className="absolute inset-x-8 top-5 h-px bg-black/10" />
        {[0, 1].map((k) => (
          <motion.span
            key={k}
            className="absolute top-5 size-2 -translate-y-1/2 rounded-full bg-violet shadow-[0_0_10px_2px_rgba(195,170,245,0.8)]"
            animate={{ left: ['8%', '90%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: k * 1.4 }}
          />
        ))}
        {nodes.map(([Icon, l]) => (
          <div key={l} className="relative z-10 flex flex-col items-center gap-1.5">
            <span className="grid size-10 place-items-center rounded-xl bg-white shadow-[0_8px_16px_-8px_rgba(29,31,44,0.35)] ring-1 ring-black/5"><Icon size={18} weight="duotone" className="text-violetdeep" /></span>
            <span className="text-[11px] text-ink/60">{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WebsiteCard({ seen }) {
  const scores = [['Speed', 100], ['SEO', 100], ['Access', 98]]
  return (
    <div className={`${cardCls} overflow-hidden`}>
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#f7f6f2] px-3.5 py-2">
        <span className="size-2 rounded-full bg-pink" /><span className="size-2 rounded-full bg-sun" /><span className="size-2 rounded-full bg-mint" />
        <Tag tone="ml-auto bg-butter text-sundeep">Websites</Tag>
      </div>
      <div className="space-y-2 p-4">
        <div className="h-12 rounded-lg bg-gradient-to-r from-rose via-lavender to-sky" />
        <div className="grid grid-cols-3 gap-2"><div className="h-8 rounded-md bg-butter" /><div className="h-8 rounded-md bg-mintsoft" /><div className="h-8 rounded-md bg-rose" /></div>
        <div className="flex flex-wrap gap-2 pt-1">
          {scores.map(([l, v], i) => (
            <motion.span
              key={l}
              className="flex items-center gap-1.5 rounded-full bg-mintsoft px-2.5 py-1 text-[12px] font-semibold text-mintdeep"
              initial={false}
              animate={seen >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease, delay: i * 0.15 }}
            >
              <CheckCircle size={13} weight="fill" /> {l} <span className="tabular-nums">{v}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- left panel ---------------- */

function BoardPanel({ t }) {
  const seen = useSeen(t)
  return (
    <div className="@container flex h-full flex-col rounded-[20px] bg-white/80 p-3 ring-1 ring-black/[0.05] sm:p-4">
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
        <SquaresFour size={14} /> What we build
      </p>
      <div
        className="mt-3 flex flex-1 flex-col justify-between gap-5 rounded-2xl p-4 pt-6"
        style={{ backgroundImage: 'radial-gradient(rgba(19,18,9,0.1) 1px, transparent 1px)', backgroundSize: '16px 16px', backgroundColor: '#faf9f6' }}
      >
        <Reveal show><Note show={seen >= 1} color="#e58cb0">Replaces 7 tools</Note><SoftwareCard seen={seen} /></Reveal>
        <div className="grid gap-5 @md:grid-cols-2">
          <Reveal show={seen >= 1}><AgentCard t={t} /></Reveal>
          <Reveal show={seen >= 2}><IntegrationCard /></Reveal>
        </div>
        <Reveal show={seen >= 3}><Note show={seen >= 4} color="#4f8fe0">Runs while you sleep</Note><AutomationCard /></Reveal>
        <Reveal show={seen >= 4}><Note show={seen >= 5} color="#4f8fe0">Loads in 0.8s ✓</Note><WebsiteCard seen={seen} /></Reveal>
      </div>
    </div>
  )
}

/* ---------------- right panel ---------------- */

const QUESTION = 'Process this order email, update our ERP and book the carrier.'
const ANSWER = 'Done. I matched PO-7714 from Coastline Freight, reserved stock in the ERP and drafted the invoice. Total $4,212.80, waiting for your approval.'
const HIGHLIGHT = 'PO-7714 from Coastline Freight'
const steps = [
  ['Read the email from Coastline Freight', '0.4s'],
  ['Extracted PO-7714 and 14 line items', '0.9s'],
  ['Checked stock and pricing in the ERP', '1.5s'],
  ['Matched the account in the CRM', '1.9s'],
  ['Drafted the invoice for approval', '2.4s'],
]
const sources = ['erp.your-business.app', 'crm/coastline-4410', 'invoice-0847.pdf']
const results = [['2.4s', 'Time to process'], ['0', 'Errors this week'], ['31.5h', 'Saved weekly']]

function AnswerPanel({ t }) {
  const qn = useTyped(QUESTION, t <= 14, 30)
  const an = useTyped(ANSWER, t >= 2 && t <= 14, 36)
  const hi = ANSWER.indexOf(HIGHLIGHT)
  const a1 = ANSWER.slice(0, Math.min(an, hi))
  const a2 = an > hi ? ANSWER.slice(hi, Math.min(an, hi + HIGHLIGHT.length)) : ''
  const a3 = an > hi + HIGHLIGHT.length ? ANSWER.slice(hi + HIGHLIGHT.length, an) : ''
  const done = an >= ANSWER.length

  return (
    <div className="flex h-full flex-col rounded-[20px] bg-white/80 p-3 ring-1 ring-black/[0.05] sm:p-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55"><Sparkle size={14} /> AI agent · live</p>
        <span className="flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-1 text-[11px] font-semibold text-mintdeep"><span className="pulse-dot size-1.5 rounded-full bg-mintdeep" /> Live</span>
      </div>

      <div className="mt-4 min-h-[72px] rounded-2xl bg-ink px-4 py-3 text-[15px] leading-snug text-white">
        {QUESTION.slice(0, qn)}
        {qn < QUESTION.length && <span className="caret ml-0.5 text-white/70" />}
      </div>

      <div className="mt-3 flex flex-1 flex-col rounded-2xl bg-white p-4 ring-1 ring-black/[0.06]">
        <p className="flex items-center gap-2 text-[13px] text-ink/55"><span className="size-2 rounded-full bg-pinkdeep" /> Assistant</p>
        <p className="mt-2 min-h-[110px] text-[15px] leading-[1.55] text-ink/80">
          {a1}
          {a2 && <mark className="rounded-sm bg-pink px-0.5 font-semibold text-ink">{a2}</mark>}
          {a3}
          {t >= 2 && !done && <span className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] bg-pinkdeep" />}
        </p>

        <ul className="mt-3 flex flex-1 flex-col justify-evenly gap-2 border-t border-black/[0.06] pt-3">
          {steps.map(([s, time], i) => {
            const on = t >= 5 + i
            return (
              <motion.li key={s} className="flex items-center gap-2.5 text-[13px]" initial={false} animate={{ opacity: on ? 1 : 0.4 }} transition={{ duration: 0.4 }}>
                <span className={`grid size-[18px] shrink-0 place-items-center rounded-full transition-colors duration-500 ${on ? 'bg-mint' : 'bg-black/10'}`}>
                  {on && <CheckCircle size={12} weight="fill" className="text-white" />}
                </span>
                <span className={on ? 'text-ink' : 'text-ink/55'}>{s}</span>
                <span className="ml-auto font-mono text-[11px] text-ink/45">{on ? time : ''}</span>
              </motion.li>
            )
          })}
        </ul>

        <div className="flex flex-wrap gap-1.5 pt-3">
          {sources.map((s, i) => (
            <motion.span
              key={s}
              className="flex items-center gap-1 rounded-full bg-black/[0.04] px-2.5 py-1 text-[12px] text-ink/65"
              initial={false}
              animate={t >= 10 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease, delay: i * 0.12 }}
            >
              <LinkSimple size={12} /> {s}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {results.map(([v, l], i) => (
          <motion.div
            key={l}
            className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-black/[0.06]"
            initial={false}
            animate={t >= 11 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.55, ease, delay: i * 0.12 }}
          >
            <p className="font-display text-[20px] font-semibold tabular-nums">{v}</p>
            <p className="text-[11px] text-ink/55">{l}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 ring-1 ring-black/[0.06]">
        <span className="flex-1 truncate text-[13px] text-ink/45">Ask your business anything…</span>
        <span className="grid size-9 place-items-center rounded-full bg-pink"><PaperPlaneRight size={15} weight="fill" className="text-ink" /></span>
      </div>
    </div>
  )
}

/* ---------------- the window ---------------- */

export default function HeroShowcase() {
  const t = useLoop()
  return (
    <div className="relative flex flex-1 flex-col">
      <div aria-hidden className="halo"><span style={{ top: '-10%', left: '-8%', width: '55%', height: '55%', background: '#fbcfe0' }} /><span style={{ top: '-6%', right: '-6%', width: '45%', height: '45%', background: '#fdeaa8' }} /><span style={{ bottom: '-10%', left: '10%', width: '50%', height: '50%', background: '#cfe3fb' }} /><span style={{ bottom: '-8%', right: '-4%', width: '45%', height: '45%', background: '#c6efd8' }} /><span style={{ top: '30%', left: '35%', width: '35%', height: '35%', background: '#e1d6fb' }} /></div>
      <div className="flex flex-1 flex-col rounded-[28px] card-soft p-3 sm:p-4">
        <div className="flex items-center gap-3 pb-3">
          <span className="flex gap-1.5">
            <span className="size-3 rounded-full bg-black/10" /><span className="size-3 rounded-full bg-black/10" /><span className="size-3 rounded-full bg-black/10" />
          </span>
          <span className="flex min-w-0 items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[12px] text-ink/65 ring-1 ring-black/[0.05]">
            <Lock size={12} /> <span className="truncate">stat6.si × your business</span>
          </span>
        </div>
        <div className="grid flex-1 gap-3 lg:grid-cols-[1.08fr_1fr]">
          <div className="min-h-0 min-w-0"><BoardPanel t={t} /></div>
          <div className="min-h-0 min-w-0"><AnswerPanel t={t} /></div>
        </div>
      </div>
    </div>
  )
}
