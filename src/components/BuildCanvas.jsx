import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  EnvelopeSimple, Robot, Database, UsersThree, Receipt, CheckCircle, CircleNotch, Lightning, ShieldCheck,
} from '@phosphor-icons/react'
import { Brand, ease } from './ui'

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
          {done && <CheckCircle size={14} weight="fill" className="text-mintdeep" />}
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

export default function BuildCanvas() {
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
      <div aria-hidden className="halo"><span style={{ top: "-10%", left: "-8%", width: "55%", height: "55%", background: "#fbcfe0" }} /><span style={{ top: "-6%", right: "-6%", width: "45%", height: "45%", background: "#fdeaa8" }} /><span style={{ bottom: "-10%", left: "10%", width: "50%", height: "50%", background: "#cfe3fb" }} /><span style={{ bottom: "-8%", right: "-4%", width: "45%", height: "45%", background: "#c6efd8" }} /><span style={{ top: "30%", left: "35%", width: "35%", height: "35%", background: "#e1d6fb" }} /></div>
      <div className="overflow-hidden rounded-[28px] card-soft">
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-black/10" /><span className="size-2.5 rounded-full bg-black/10" /><span className="size-2.5 rounded-full bg-black/10" />
          </span>
          <span className="font-mono text-xs text-ink/50">order-intake.workflow</span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-mint/10 px-2 py-0.5 text-[11px] font-medium text-mintdeep">
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
            <Wire d="M45 17 C 50 17, 50 17, 54 17" live={t >= 1} color="#ef8fb4" />
            <Wire d="M76 50 C 76 52, 76 53, 76 55" live={t >= 5} color="#f6d365" />
            <Wire d="M54 72 C 51 72, 51 70, 47 70" live={t >= 9} color="#6fcf9f" />
          </svg>

          {/* 1. trigger */}
          <Node on={t >= 0} done={t >= 1} className="sm:left-[3%] sm:top-[5%] sm:w-[42%]" label="Trigger · new email" Icon={EnvelopeSimple} tone="bg-rose text-pinkdeep">
            <p className="truncate text-xs font-semibold">PO-7714 from Coastline Freight</p>
            <p className="mt-0.5 truncate text-[11px] text-ink/55">orders@coastlinefreight.com · 2 attachments</p>
          </Node>

          {/* 2. AI agent */}
          <Node on={t >= 1} done={t >= 5} className="sm:left-[54%] sm:top-[5%] sm:w-[43%]" label="AI agent · read and extract" Icon={Robot} tone="bg-butter text-sundeep">
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
          <Node on={t >= 5} done={t >= 9} className="sm:left-[54%] sm:top-[55%] sm:w-[43%]" label="Integrations" Icon={Lightning} tone="bg-lavender text-violetdeep">
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
          <Node on={t >= 9} done={landed} className="sm:left-[3%] sm:top-[44%] sm:w-[44%]" label="Your app · Orders" Icon={ShieldCheck} tone="bg-mintsoft text-mintdeep">
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
                    <div className="flex items-center gap-2 bg-pink/10 px-2 py-1.5 text-[11px]">
                      <span className="font-semibold">Coastline Freight</span>
                      <span className="ml-auto font-mono">$4,212.80</span>
                      <span className="rounded-full bg-pink px-1.5 py-0.5 text-[10px] font-semibold text-ink">Ready</span>
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
        <p className="text-[11px] text-ink/55">Before <Brand /></p>
        <p className="text-sm"><span className="font-semibold">22 minutes</span> of copy and paste per order</p>
      </motion.div>
    </div>
  )
}

