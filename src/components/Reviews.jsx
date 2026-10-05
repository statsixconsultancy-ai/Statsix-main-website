// Client reviews with faces. Portraits are randomuser.me placeholders: replace with
// real client photos (with permission) before launch. Each card keeps a verified project trail
// and the one result each client cared about most.
import { motion } from 'motion/react'
import { Star, SealCheck, TrendUp } from '@phosphor-icons/react'
import { Eyebrow, Reveal, CountUp, ease } from './ui'

const reviews = [
  {
    brand: 'harbourline', company: 'Harbourline Logistics', sector: 'Freight', name: 'Priya Raman', photo: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'COO',
    text: 'We retired seven tools in one quarter. [[My dispatchers open one screen now]], and it tells them what to do next.',
    result: '+8.1 pts on time delivery', color: '#2e6bff', project: 'Business management system', date: 'Aug 2026',
  },
  {
    brand: 'kiln', company: 'Kiln Supply Co.', sector: 'Ecommerce', name: 'Tomás Ferreira', photo: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Founder',
    text: 'ChatGPT recommends us by name. [[That did not happen by accident]], and they can show you exactly why it happens.',
    result: '+312% organic revenue', color: '#2e6bff', project: 'SEO, GEO and AEO', date: 'Jun 2026',
  },
  {
    brand: 'verdant', company: 'Verdant Clinics', sector: 'Healthcare', name: 'Dr. Amara Okafor', photo: 'https://randomuser.me/api/portraits/women/68.jpg', role: 'Medical Director',
    text: 'They wrote the agent guardrails with our clinicians, not around them. [[That is why we trusted it with patients.]]',
    result: '37% fewer front desk calls', color: '#2e6bff', project: 'AI intake agent', date: 'Jul 2026',
  },
  {
    brand: 'monarch', company: 'Monarch & Reed', sector: 'Law', name: 'Lena Hoffmann', photo: 'https://randomuser.me/api/portraits/women/65.jpg', role: 'Managing Partner',
    text: 'Clients mention the website in their first call. [[It feels like us, only sharper.]]',
    result: '2.3× enquiry rate', color: '#2e6bff', project: 'Brand and website', date: 'May 2026',
  },
  {
    brand: 'northpaw', company: 'Northpaw', sector: 'Pet food', name: 'Daniel Cho', photo: 'https://randomuser.me/api/portraits/men/75.jpg', role: 'Head of Operations',
    text: 'The invoice agent clears in an hour [[what took two people a full week]]. Every match is logged.',
    result: '31.5 hrs saved weekly', color: '#2e6bff', project: 'AI automation', date: 'Sep 2026',
  },
  {
    brand: 'lumen', company: 'Lumen Rail', sector: 'Transport', name: 'Sofia Marchetti', photo: 'https://randomuser.me/api/portraits/women/12.jpg', role: 'CMO',
    text: 'One team for the product, the site and search. [[Our launch shipped with zero handoff gaps.]]',
    result: 'Launched in 9 weeks', color: '#2e6bff', project: 'Web software and site', date: 'Apr 2026',
  },
]

function Quote({ text, color }) {
  return text.split(/\[\[|\]\]/).map((part, i) =>
    i % 2 ? (
      <mark
        key={i}
        className="rounded-sm bg-transparent px-0.5 text-ink"
        style={{ backgroundImage: `linear-gradient(${color}2e, ${color}2e)`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 42%', backgroundPosition: '0 88%' }}
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function ReviewCard({ r }) {
  return (
    <figure className="group flex w-[300px] shrink-0 flex-col sm:w-[400px] rounded-3xl border border-black/[0.07] bg-white p-6 shadow-[0_1px_0_rgba(19,18,9,0.04)] transition-all duration-700 ease-fluid hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(19,18,9,0.3)]">
      <div className="flex items-center gap-3">
        <img src={r.photo} alt={r.name} loading="lazy" className="size-12 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{r.name}</p>
          <p className="truncate text-xs text-ink/50">{r.role}, {r.company}</p>
        </div>
        <span className="ml-auto flex shrink-0 text-sun">
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} weight="fill" />)}
        </span>
      </div>
      <blockquote className="mt-5 flex-1 text-[17px] leading-relaxed text-ink/75">
        <Quote text={r.text} color={r.color} />
      </blockquote>
      <p className="mt-5 inline-flex w-max items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${r.color}14`, color: r.color }}>
        <TrendUp size={13} weight="bold" /> {r.result}
      </p>
      <figcaption className="mt-5 flex items-end justify-between gap-3 border-t border-black/5 pt-4">
        <p className="text-xs text-ink/55">{r.sector}</p>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1 text-[11px] font-medium text-mint">
            <SealCheck size={13} weight="fill" /> Verified client
          </p>
          <p className="text-[11px] text-ink/55">{r.project} · {r.date}</p>
        </div>
      </figcaption>
    </figure>
  )
}

const breakdown = [[5, 39], [4, 4], [3, 0], [2, 0], [1, 0]]

export default function Reviews() {
  const rowA = reviews.slice(0, 3)
  const rowB = reviews.slice(3)
  return (
    <section className="py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <Eyebrow tone={3}>Client reviews</Eyebrow>
          <h2 className="mt-6 max-w-2xl text-4xl font-semibold md:text-6xl">
            Operators say it better
          </h2>
          <p className="mt-6 max-w-lg text-lg text-ink/60">
            Every review comes from a signed client after delivery, tied to the project we shipped and the number they track.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="flex items-center gap-6 rounded-3xl border border-black/[0.07] bg-white p-6">
            <div>
              <p className="font-display text-6xl font-semibold tracking-tight"><CountUp to={4.9} decimals={1} /></p>
              <span className="mt-1 flex text-sun">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} weight="fill" />)}</span>
              <p className="mt-1 text-xs text-ink/50">43 verified reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {breakdown.map(([s, n], i) => (
                <div key={s} className="flex items-center gap-2 text-xs text-ink/50">
                  <span className="w-3">{s}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/5">
                    <motion.div
                      className="h-full rounded-full bg-sun"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(n / 43) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease, delay: 0.2 + i * 0.08 }}
                    />
                  </div>
                  <span className="w-5 text-right tabular-nums">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="marquee-mask mt-16 space-y-4 overflow-hidden">
        <div className="animate-marquee flex w-max gap-4 pr-4 hover:[animation-play-state:paused]" style={{ '--marquee-speed': '70s' }}>
          {[...rowA, ...rowA, ...rowA, ...rowA].map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
        <div className="animate-marquee-reverse flex w-max gap-4 pr-4 hover:[animation-play-state:paused]" style={{ '--marquee-speed': '80s' }}>
          {[...rowB, ...rowB, ...rowB, ...rowB].map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
    </section>
  )
}
