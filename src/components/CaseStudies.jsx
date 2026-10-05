import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { BrowserFrame } from './Mocks'
import { MockOps, MockClinic, MockEditorial, MockSearch } from './CaseMocks'
import { Eyebrow, Reveal, Tilt, ease } from './ui'

// Each case tells its story in three steps that advance as you scroll.
// The active step reads in the left column; a numbered pin marks where it shows up in the product.
const storyLabels = ['What we did', 'What we changed', 'The result']

const cases = [
  {
    client: 'Harbourline Logistics',
    tone: '#2e6bff',
    sector: 'Freight · 340 staff',
    service: 'Business management system',
    headline: 'Custom operations software',
    title: 'Seven legacy tools folded into one live operations console',
    url: 'ops.harbourline.co',
    Mock: MockOps,
    metrics: [['+8.1 pts', 'on time delivery'], ['63%', 'exceptions auto resolved'], ['11 wks', 'to first release']],
    story: [
      'We sat with their dispatch floor, mapped 41 rules and built one system that replaced seven tools.',
      'An AI agent watches every load and proposes reroutes before a dispatcher even sees the delay.',
      '+8.1 pts on time delivery and 26 hours a week handed back to the dispatch team.',
    ],
    pins: [[24, 62], [74, 30], [62, 48]],
  },
  {
    client: 'Verdant Clinics',
    tone: '#12b886',
    sector: 'Healthcare · 12 sites',
    service: 'AI agent',
    headline: 'AI intake and booking agent',
    title: 'An intake agent that triages and books patients around the clock',
    url: 'care.verdantclinics.com',
    Mock: MockClinic,
    metrics: [['4m 12s', 'average intake time'], ['37%', 'fewer front desk calls'], ['24/7', 'booking coverage']],
    story: [
      'We built an AI agent that triages symptoms and books patients into real clinic slots, day and night.',
      'Clinicians wrote and approve every rule, and any red flag hands off to a human instantly.',
      '37% fewer front desk calls and a four minute average intake.',
    ],
    pins: [[30, 55], [78, 66], [78, 88]],
  },
  {
    client: 'Monarch & Reed',
    tone: '#8b5cf6',
    sector: 'Law · 3 offices',
    service: 'Award grade website',
    headline: 'Brand and website design',
    title: 'A quiet, editorial site for a firm that never needed to shout',
    url: 'monarchreed.law',
    Mock: MockEditorial,
    metrics: [['2.3×', 'enquiry rate'], ['0.8s', 'largest contentful paint'], ['SOTD', 'design nomination']],
    story: [
      'A new brand, an editorial type system and a photo led site, with partner pages fed from their CMS.',
      'Cinematic motion on a strict budget: under 90 KB of JavaScript and 0.8 seconds to load.',
      '2.3× more enquiries in the first quarter after launch.',
    ],
    pins: [[22, 58], [88, 18], [70, 82]],
  },
  {
    client: 'Kiln Supply Co.',
    tone: '#ff6a3d',
    sector: 'Ecommerce · DTC',
    service: 'SEO, GEO and AEO',
    headline: 'SEO, GEO and AI search visibility',
    title: 'From page three on Google to the answer inside AI search',
    url: 'google.com/search',
    Mock: MockSearch,
    metrics: [['+312%', 'organic revenue'], ['14', 'AI Overview citations'], ['#2', 'for core category']],
    story: [
      'We rebuilt product data and schema on 2,400 SKUs and wrote 60 expert buying guides.',
      'We wrote for AI answers as well as Google, and tracked citations in ChatGPT and Perplexity.',
      '+312% organic revenue and 14 citations inside AI Overviews.',
    ],
    pins: [[30, 74], [36, 36], [86, 36]],
  },
]

/* Small numbered marker that moves to the part of the product each step refers to */
function Pin({ step, at }) {
  return (
    <motion.div
      className="pointer-events-none absolute z-20 hidden lg:block"
      initial={false}
      animate={{ left: `${at[0]}%`, top: `${at[1]}%` }}
      transition={{ duration: 0.9, ease }}
      style={{ x: '-50%', y: '-50%' }}
    >
      <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-ink/20" style={{ animationDuration: '1.8s' }} />
      <motion.span
        key={step}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="relative grid size-8 place-items-center rounded-full bg-ink font-mono text-xs font-semibold text-white shadow-[0_8px_20px_-6px_rgba(19,18,9,0.6)] ring-4 ring-white"
      >
        {step + 1}
      </motion.span>
    </motion.div>
  )
}

/* Scroll synced story: active step expanded, the rest collapsed */
function Story({ story, step }) {
  return (
    <ol className="relative mt-8 border-l border-black/10">
      <motion.span
        aria-hidden
        className="absolute -left-px top-0 hidden w-px bg-ink lg:block"
        animate={{ height: `${((step + 1) / 3) * 100}%` }}
        transition={{ duration: 0.8, ease }}
      />
      {story.map((text, k) => {
        const on = k === step
        return (
          <li key={k} className="relative pb-5 pl-6 last:pb-0">
            <span
              className={`absolute -left-[5px] top-1.5 size-[9px] rounded-full border-2 border-white transition-colors duration-500 ${
                k <= step ? 'bg-ink' : 'bg-black/15'
              } max-lg:bg-ink`}
            />
            <p className={`font-mono text-xs uppercase tracking-wider transition-colors duration-500 ${on ? 'text-ink' : 'text-ink/35'} max-lg:text-ink/60`}>
              0{k + 1} · {storyLabels[k]}
            </p>
            {/* desktop: only the active step shows its text */}
            <motion.div
              initial={false}
              animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.55, ease }}
              className="hidden overflow-hidden lg:block"
            >
              <p className={`pt-2 text-ink/80 ${k === 2 ? 'text-xl font-medium text-ink' : 'text-base'}`}>{text}</p>
            </motion.div>
            {/* mobile: everything visible */}
            <p className={`pt-1.5 text-ink/80 lg:hidden ${k === 2 ? 'font-medium text-ink' : ''}`}>{text}</p>
          </li>
        )
      })}
    </ol>
  )
}

function CaseCard({ c, i, total, progress }) {
  const start = i / total
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i) * 0.04])
  const dim = useTransform(progress, [start, 1], [0, (total - i - 1) * 0.1])
  const { Mock } = c
  const spacer = useRef(null)
  const { scrollYProgress: story } = useScroll({ target: spacer, offset: ['start end', 'end end'] })
  const [step, setStep] = useState(0)
  useMotionValueEvent(story, 'change', (p) => setStep(p < 0.34 ? 0 : p < 0.67 ? 1 : 2))

  return (
    <>
      <div className="sticky top-0 flex min-h-screen items-center py-20">
        <motion.article
          style={{ scale, top: `${i * 24}px` }}
          className="relative w-full origin-top overflow-hidden rounded-[2rem] border border-black/10 bg-white p-6 md:p-10"
        >
          <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-30 bg-black" />
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 font-medium text-ink">
                  <span className="size-1.5 rounded-full" style={{ background: c.tone }} /> {c.service}
                </span>
                <span className="rounded-full border border-black/10 px-3 py-1 text-ink/55">{c.sector}</span>
              </div>
              <p className="mt-6 font-mono text-sm text-ink/40">0{i + 1} · {c.client}</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{c.headline}</h3>
              <p className="mt-3 text-lg text-ink/55">{c.title}</p>

              <Story story={c.story} step={step} />

              <div className="mt-8 grid grid-cols-3 divide-x divide-black/10 border-y border-black/10">
                {c.metrics.map(([v, l]) => (
                  <div key={l} className="px-3 py-4 first:pl-0">
                    <p className="font-display text-xl font-medium tracking-tight tabular-nums sm:text-2xl">{v}</p>
                    <p className="mt-1 text-xs text-ink/50">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <Tilt max={4}>
                <div className="relative">
                  <BrowserFrame url={c.url}>
                    <Mock />
                  </BrowserFrame>
                  <Pin step={step} at={c.pins[step]} />
                </div>
              </Tilt>
            </div>
          </div>
        </motion.article>
      </div>
      <div ref={spacer} aria-hidden className="hidden h-[70vh] lg:block" />
    </>
  )
}

export default function CaseStudies() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section id="work" className="relative px-4 pt-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow tone={1}>Selected work</Eyebrow>
            <h2 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
              Proof, not <span className="font-serif text-blue">promises</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-sm text-ink/60">
            Four recent builds. Scroll through each one to see what we did, what we changed and what it earned.
          </Reveal>
        </div>
        <div ref={ref} className="relative mt-8">
          {cases.map((c, i) => (
            <CaseCard key={c.client} c={c} i={i} total={cases.length} progress={scrollYProgress} />
          ))}
        </div>
        <div className="flex justify-center pb-8">
          <a href="#contact" className="inline-flex items-center gap-2 text-ink/60 transition-all duration-700 ease-fluid hover:text-ink">
            Want results like these? Talk to us <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  )
}
