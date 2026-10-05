// Placeholder product previews, drawn in markup so they stay crisp at any size.
// Swap any of these for real screenshots: <img src="/work/harbourline.webp" alt="…" />
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Lightning } from '@phosphor-icons/react'

export function BrowserFrame({ url, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_40px_80px_-30px_rgba(19,18,9,0.35)]">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f7f6f2] px-4 py-3">
        <span className="size-2.5 rounded-full bg-black/10" />
        <span className="size-2.5 rounded-full bg-black/10" />
        <span className="size-2.5 rounded-full bg-black/10" />
        <span className="mx-auto truncate rounded-md bg-white px-3 py-1 font-mono text-xs text-ink/50 ring-1 ring-black/5">{url}</span>
      </div>
      <div className="aspect-[16/10] overflow-hidden">{children}</div>
    </div>
  )
}

const feedPool = [
  ['Reconciled 42 invoices', 'text-blue'],
  ['Flagged late PO #7714', 'text-amber-600'],
  ['Drafted 18 customer replies', 'text-blue'],
  ['Restocked SKU K-220', 'text-mint'],
  ['Synced 311 orders to ERP', 'text-blue'],
  ['Chased 6 overdue invoices', 'text-amber-600'],
  ['Booked 4 carrier slots', 'text-blue'],
  ['Updated cash forecast', 'text-mint'],
]

/* New agent events slide in at the top every few seconds */
export function LiveFeed() {
  const [items, setItems] = useState(() => feedPool.slice(0, 4).map((f, i) => ({ id: i, f, t: ['now', '2m', '9m', '14m'][i] })))
  useEffect(() => {
    let n = 4
    const t = setInterval(() => {
      setItems((prev) => [{ id: n, f: feedPool[n++ % feedPool.length], t: 'now' }, ...prev.slice(0, 3).map((x, i) => ({ ...x, t: ['1m', '3m', '9m'][i] }))])
    }, 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex flex-col gap-1.5 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map(({ id, f: [text, tone], t }) => (
          <motion.div
            key={id}
            layout
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="flex items-center gap-2 rounded-md bg-white px-2 py-1.5 text-[10px] ring-1 ring-black/[0.05]"
          >
            <Lightning size={10} weight="fill" className={`shrink-0 ${tone}`} />
            <span className="truncate text-ink/75">{text}</span>
            <span className="ml-auto shrink-0 text-ink/45">{t}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
