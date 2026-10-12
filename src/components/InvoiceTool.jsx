// "Try our free invoice generator" section. The animation is a miniature of the real
// tool at invoice.stat6.si: an editor on the left, a live A4 invoice on the right,
// totals calculating as line items are added, then the PDF export.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import {
  ArrowUpRight, Receipt, FilePdf, UserCircle, Lock, CheckCircle, CircleNotch, Bank, Stack, CurrencyDollar, Plus,
} from '@phosphor-icons/react'
import { Eyebrow, Reveal, Roll, Magnet, Brand, ease } from './ui'

export const INVOICE_URL = 'https://invoice.stat6.si'

const items = [
  ['Brand identity package', 1850],
  ['Website copy (6 pages)', 940],
  ['Revisions round', 424.5],
]
const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const features = [
  [Stack, 'Live preview as you type'],
  [FilePdf, 'Real print ready A4 PDFs'],
  [Bank, 'Save bank and UPI details once'],
  [CurrencyDollar, 'USD, EUR, GBP, INR and more'],
  [Lock, 'Private to your account'],
]

// one tick = 0.9s. 0 blank · 1 customer · 2-4 line items · 5 totals · 6 download · 7 PDF ready · 8-9 hold
const TICKS = 11

function Skeleton({ className = '' }) {
  return <span className={`block h-2.5 rounded bg-black/[0.07] ${className}`} />
}

function Editor({ t }) {
  const filled = (n) => t >= n
  return (
    <div className="rounded-[22px] card-soft p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">New document</p>
        <span className="flex rounded-full bg-black/[0.05] p-0.5 text-[11px] font-medium">
          <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">Invoice</span>
          <span className="px-2.5 py-1 text-ink/50">Receipt</span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <div className="col-span-2 rounded-lg bg-white/80 p-2.5 ring-1 ring-black/[0.05]">
          <p className="flex items-center gap-1 text-ink/45"><UserCircle size={12} /> Customer</p>
          <div className="mt-1 h-4">
            {filled(1) ? (
              <motion.p initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease }} className="text-[12px] font-medium">
                Priya Nair · Northfield Consulting
              </motion.p>
            ) : (
              <Skeleton className="mt-1 w-2/3" />
            )}
          </div>
        </div>
        <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-black/[0.05]">
          <p className="text-ink/45">Currency</p>
          <p className="mt-1 text-[12px] font-medium">USD</p>
        </div>
        <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-black/[0.05]">
          <p className="text-ink/45">Due</p>
          <p className="mt-1 text-[12px] font-medium">Net 14 days</p>
        </div>
      </div>

      <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-ink/45">Line items</p>
      <div className="mt-2 space-y-2">
        {items.map(([name, amount], i) => {
          const on = filled(i + 2)
          const typing = t === i + 2
          return (
            <div key={name} className="grid grid-cols-[1fr_5.5rem] gap-2 text-[11px]">
              <div className={`rounded-lg bg-white/80 px-2.5 py-2 ring-1 transition-all duration-500 ${typing ? 'ring-pink' : 'ring-black/[0.05]'}`}>
                {on ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px]">
                    {name}{typing && <span className="caret ml-0.5 text-pinkdeep" />}
                  </motion.span>
                ) : (
                  <Skeleton className="w-3/5" />
                )}
              </div>
              <div className="rounded-lg bg-white/80 px-2.5 py-2 text-right ring-1 ring-black/[0.05]">
                {on ? <span className="text-[12px] tabular-nums">{money(amount)}</span> : <Skeleton className="ml-auto w-2/3" />}
              </div>
            </div>
          )
        })}
        <p className="flex items-center gap-1 pt-1 text-[11px] font-medium text-ink/55"><Plus size={12} weight="bold" /> Add line item</p>
      </div>

      <motion.div
        animate={{ scale: t === 6 ? 0.97 : 1 }}
        transition={{ duration: 0.25 }}
        className={`mt-4 flex items-center justify-center gap-2 rounded-full py-2.5 text-[12px] font-semibold transition-colors duration-500 ${
          t >= 7 && t < 10 ? 'bg-mint/40 text-ink' : 'bg-pink text-ink'
        }`}
      >
        {t === 6 ? (
          <><CircleNotch size={14} className="animate-spin" /> Preparing PDF</>
        ) : t >= 7 && t < 10 ? (
          <><CheckCircle size={14} weight="fill" /> Downloaded</>
        ) : (
          <><FilePdf size={14} weight="fill" /> Download PDF</>
        )}
      </motion.div>
    </div>
  )
}

function Paper({ t }) {
  const shown = items.filter((_, i) => t >= i + 2)
  const total = shown.reduce((s, [, a]) => s + a, 0)
  return (
    <div className="relative">
      <div className="rounded-[18px] bg-white p-5 shadow-[0_30px_60px_-28px_rgba(29,31,44,0.28),0_0_0_1px_rgba(29,31,44,0.05)] sm:rotate-[1.5deg] sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="block h-2 w-10 rounded bg-black/[0.08]" />
            <p className="mt-2 text-sm font-semibold">Lumen Studio</p>
            <p className="text-[11px] text-ink/50">hello@lumenstudio.co</p>
          </div>
          <div className="text-right">
            <p className="font-display text-base font-semibold tracking-tight text-bluedeep">INVOICE</p>
            <p className="text-[11px] text-ink/50">INV 0847</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-black/[0.03] p-2.5 text-[11px]">
          <p className="text-ink/45">BILL TO</p>
          <div className="mt-0.5 h-4">
            {t >= 1 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] font-medium">Priya Nair · Northfield Consulting</motion.p>
            ) : (
              <Skeleton className="mt-1 w-1/2" />
            )}
          </div>
        </div>

        <div className="mt-4 min-h-[88px] space-y-2 text-[12px]">
          {items.map(([name, amount], i) => (
            <motion.div
              key={name}
              initial={false}
              animate={{ opacity: t >= i + 2 ? 1 : 0, y: t >= i + 2 ? 0 : 8 }}
              transition={{ duration: 0.5, ease }}
              className="flex justify-between text-ink/75"
            >
              <span>{name}</span>
              <span className="tabular-nums">{money(amount)}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t border-black/10 pt-3">
          <span className="text-[12px] font-medium">Total due</span>
          <span className="font-display text-xl font-semibold tabular-nums tracking-tight text-bluedeep">
            <Roll value={Math.round(total * 100)} format={(n) => money(n / 100)} />
          </span>
        </div>
      </div>

      <AnimatePresence>
        {t >= 5 && t < 10 && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="absolute -left-3 -top-4 rounded-xl bg-white px-3 py-1.5 text-[11px] shadow-[0_14px_30px_-12px_rgba(29,31,44,0.3)]"
          >
            <span className="block text-ink/45">Auto calculated</span>
            <span className="font-semibold tabular-nums text-bluedeep">{money(items.reduce((s, [, a]) => s + a, 0))}</span>
          </motion.span>
        )}
        {t >= 7 && t < 10 && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="absolute -bottom-4 -right-2 flex items-center gap-1.5 rounded-full bg-mintsoft px-3 py-1.5 text-[11px] font-semibold text-mintdeep shadow-[0_14px_30px_-12px_rgba(29,31,44,0.25)]"
          >
            <CheckCircle size={14} weight="fill" /> PDF ready · A4
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function InvoiceTool() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setT((v) => (v + 1) % TICKS), 900)
    return () => clearInterval(id)
  }, [inView])

  return (
    <section id="invoice" aria-labelledby="invoice-heading" className="relative px-4 py-24 md:px-8 md:py-32">
      <div ref={ref} className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow tone={1}>Free tool</Eyebrow>
          <h2 id="invoice-heading" className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Try our free invoice generator
          </h2>
          <p className="mt-6 max-w-lg text-lg text-ink/60">
            Built by <Brand /> for freelancers and small teams. Build polished invoices and receipts in minutes, save your
            business details once, and download real print ready PDFs every time.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {features.map(([Icon, label], i) => (
              <li key={label} className="flex items-center gap-3 text-sm text-ink/75">
                <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${['bg-rose text-pinkdeep', 'bg-sky text-bluedeep', 'bg-butter text-sundeep', 'bg-mintsoft text-mintdeep', 'bg-lavender text-violetdeep'][i]}`}>
                  <Icon size={16} weight="duotone" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Magnet>
              <a
                href={INVOICE_URL}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-3 rounded-full bg-pink py-2 pl-6 pr-2 text-base font-semibold text-ink shadow-[0_14px_32px_-12px_rgba(240,143,180,0.8)] transition-all duration-700 ease-fluid hover:bg-pinkhover hover:scale-[1.03] active:scale-[0.98]"
              >
                Create a free invoice
                <span className="grid size-9 place-items-center rounded-full bg-white text-ink transition-transform duration-700 ease-fluid group-hover:rotate-45">
                  <ArrowUpRight weight="bold" size={16} />
                </span>
              </a>
            </Magnet>
            <p className="text-sm text-ink/55">No credit card required. First invoice in under 2 minutes.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative">
            <div aria-hidden className="halo">
              <span style={{ top: '-8%', left: '-6%', width: '50%', height: '50%', background: '#fbcfe0' }} />
              <span style={{ top: '-4%', right: '-4%', width: '42%', height: '42%', background: '#cfe3fb' }} />
              <span style={{ bottom: '-8%', left: '12%', width: '46%', height: '46%', background: '#fdeaa8' }} />
              <span style={{ bottom: '-6%', right: '0%', width: '42%', height: '42%', background: '#c6efd8' }} />
              <span style={{ top: '34%', left: '38%', width: '34%', height: '34%', background: '#e1d6fb' }} />
            </div>
            <div className="grid items-center gap-5 sm:grid-cols-2">
              <div className="hidden sm:block"><Editor t={t} /></div>
              <Paper t={t} />
            </div>
            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-ink/50">
              <Receipt size={14} /> Invoices and receipts · Live at invoice.stat6.si
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
