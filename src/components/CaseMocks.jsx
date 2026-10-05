// Rich, animated case study previews. Sizes use container query units (cqw)
// so each mock scales with the browser frame it sits in.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import {
  MagnifyingGlass, Microphone, Camera, X, DotsNine, User, LinkSimple, CaretDown, Sparkle, ArrowRight, Star,
  Robot, CheckCircle, FirstAid, ChatCircleDots, CalendarCheck, Bell, Funnel, DownloadSimple, Plus, Check, CircleNotch,
} from '@phosphor-icons/react'
import { BrandMark } from './Logos'
import { ease } from './ui'

/* ======================= Monarch & Reed: award grade site ======================= */
// A photo led, multi-section site that scrolls itself inside the browser frame.
// Page is 220cqw tall; the 16:10 frame shows 62.5cqw, so stops are % of the page.
// Photos: Unsplash (free licence). Swap for the client's own photography.

const u = (id, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`
const IMG = {
  towers: 'photo-1449157291145-7efd050a4d0e',
  library: 'photo-1505664194779-8beaceb93744',
  justice: 'photo-1589829545856-d10d557cf95f',
  office: 'photo-1497366811353-6870744d04b2',
  glass: 'photo-1554469384-e58fac16e23a',
  boardroom: 'photo-1517502884422-41eaead166d4',
}
const partners = [
  ['photo-1573496359142-b8d87734a5a2', 'Eleanor Reed', 'Disputes'],
  ['photo-1507679799987-c73779587ccf', 'James Monarch', 'Mergers & acquisitions'],
  ['photo-1519085360753-af0119f7cbe7', 'Daniel Achebe', 'Regulatory'],
  ['photo-1560250097-0b93528c311a', 'Henrik Lund', 'Private client'],
]
const stops = ['0%', '0%', '-28.4%', '-28.4%', '-48.9%', '-48.9%', '-71.6%', '-71.6%', '0%']
const thumb = ['0%', '0%', '28.4%', '28.4%', '48.9%', '48.9%', '71.6%', '71.6%', '0%']
const stopTimes = [0, 0.12, 0.26, 0.4, 0.52, 0.62, 0.74, 0.88, 1]
const practices = ['Mergers & acquisitions', 'Disputes', 'Private client', 'Regulatory', 'Restructuring', 'Employment']

export function MockEditorial() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const [hot, setHot] = useState(0)
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setHot((h) => (h + 1) % partners.length), 1200)
    return () => clearInterval(t)
  }, [inView])

  const cream = '#efe9dc'
  const green = '#14211a'
  const gold = '#d6b26e'
  const loop = { duration: 20, times: stopTimes, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }

  return (
    <div ref={ref} className="relative h-full overflow-hidden" style={{ containerType: 'inline-size', background: green }}>
      <motion.div
        className="absolute inset-x-0 top-0"
        style={{ height: '220cqw' }}
        animate={inView ? { y: stops } : { y: '0%' }}
        transition={inView ? loop : { duration: 0.6 }}
      >
        {/* 1 · Hero: full bleed photograph */}
        <section className="relative overflow-hidden" style={{ height: '62.5cqw', color: cream }}>
          <motion.img
            src={u(IMG.towers)} alt="" className="absolute inset-0 h-full w-full object-cover"
            animate={{ scale: [1.05, 1.18, 1.05] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${green}cc 0%, ${green}33 35%, ${green}e6 100%)` }} />
          <div className="relative z-10 flex items-center justify-between px-[4cqw] py-[2.6cqw]" style={{ fontSize: '1.4cqw' }}>
            <span className="font-serif" style={{ fontSize: '2.4cqw' }}>Monarch &amp; Reed</span>
            <span className="flex gap-[2.6cqw] opacity-80"><span>Practice</span><span>People</span><span>Insight</span><span>Offices</span></span>
            <span className="rounded-full border px-[1.6cqw] py-[0.7cqw]" style={{ borderColor: `${cream}66` }}>Book a consultation</span>
          </div>
          <div className="absolute bottom-[5cqw] left-[4cqw] z-10">
            <p className="font-mono uppercase tracking-[0.25em] opacity-70" style={{ fontSize: '1.1cqw' }}>London · Zurich · Singapore</p>
            <h4 className="mt-[1.4cqw] font-serif leading-[0.9]" style={{ fontSize: '9cqw', letterSpacing: '-0.025em' }}>
              {['Counsel for', 'consequential', 'moments.'].map((l, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span className="block" initial={{ y: '105%' }} animate={inView ? { y: '0%' } : {}} transition={{ duration: 1.3, ease, delay: 0.2 + i * 0.15 }}>
                    {i === 2 ? <>moments<span style={{ color: gold }}>.</span></> : l}
                  </motion.span>
                </span>
              ))}
            </h4>
          </div>
          <div className="absolute bottom-[5cqw] right-[4cqw] z-10 w-[22cqw] border-t pt-[1.2cqw]" style={{ borderColor: `${cream}55`, fontSize: '1.3cqw' }}>
            <p className="opacity-80">Partner led counsel for boards, founders and families since 1987.</p>
            <p className="mt-[1.2cqw] flex items-center gap-[0.8cqw]">Scroll to explore <ArrowRight size="1.4cqw" style={{ transform: 'rotate(90deg)' }} /></p>
          </div>
          <motion.svg viewBox="0 0 100 100" className="absolute right-[4cqw] top-[9cqw] z-10 size-[10cqw]" animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}>
            <defs><path id="seal" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
            <circle cx="50" cy="50" r="49" fill="none" stroke={gold} strokeWidth="1" />
            <text fontSize="9" letterSpacing="2.6" fill={gold} fontFamily="Geist Mono"><textPath href="#seal">SITE OF THE DAY · AWARD WINNING ·</textPath></text>
            <text x="50" y="58" textAnchor="middle" fontSize="22" fill={gold} fontFamily="Instrument Serif">✦</text>
          </motion.svg>
        </section>

        {/* 2 · Intro: statement + photograph */}
        <section className="grid grid-cols-5 gap-[4cqw] px-[4cqw] py-[5cqw]" style={{ height: '45cqw', background: cream, color: green }}>
          <div className="col-span-3 flex flex-col justify-between">
            <p className="font-mono uppercase tracking-[0.25em] opacity-60" style={{ fontSize: '1.1cqw' }}>(01) The firm</p>
            <p className="font-serif leading-[1.08]" style={{ fontSize: '4.2cqw' }}>
              Thirty eight partners. Three cities. <span style={{ color: '#9a7a3c' }}>One standard</span> of work that rarely makes the news, because it rarely needs to.
            </p>
            <div className="flex gap-[4cqw] border-t pt-[1.4cqw]" style={{ borderColor: `${green}33` }}>
              {[['£4.2bn', 'advised in 2025'], ['38', 'partners'], ['97%', 'client retention']].map(([n, l]) => (
                <div key={l}><p className="font-serif" style={{ fontSize: '3cqw' }}>{n}</p><p className="opacity-60" style={{ fontSize: '1.1cqw' }}>{l}</p></div>
              ))}
            </div>
          </div>
          <div className="col-span-2 overflow-hidden rounded-[0.6cqw]">
            <motion.img src={u(IMG.library, 900)} alt="" className="h-[120%] w-full object-cover" animate={{ y: ['0%', '-16%', '0%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
        </section>

        {/* 3 · Practice gallery */}
        <section className="overflow-hidden py-[4.5cqw]" style={{ height: '45cqw', background: green, color: cream }}>
          <div className="flex items-end justify-between px-[4cqw]">
            <h5 className="font-serif leading-none" style={{ fontSize: '5cqw' }}>Practice</h5>
            <p className="font-mono uppercase tracking-[0.25em] opacity-60" style={{ fontSize: '1.1cqw' }}>(02) Six disciplines</p>
          </div>
          <div className="mt-[3cqw] flex w-max gap-[2cqw] pl-[4cqw] animate-marquee" style={{ '--marquee-speed': '40s' }}>
            {[...Array(2)].flatMap((_, k) =>
              [[IMG.justice, 'Disputes'], [IMG.boardroom, 'Mergers & acquisitions'], [IMG.glass, 'Regulatory'], [IMG.office, 'Restructuring']].map(([img, name], i) => (
                <figure key={`${k}-${name}`} className="w-[26cqw] shrink-0">
                  <div className="overflow-hidden rounded-[0.5cqw]" style={{ height: '24cqw' }}>
                    <img src={u(img, 700)} alt="" className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="mt-[1cqw] flex items-baseline justify-between" style={{ fontSize: '1.2cqw' }}>
                    <span className="font-serif" style={{ fontSize: '2.1cqw' }}>{name}</span>
                    <span className="font-mono opacity-50">0{i + 1}</span>
                  </figcaption>
                </figure>
              )),
            )}
          </div>
        </section>

        {/* 4 · Partners */}
        <section className="px-[4cqw] py-[4cqw]" style={{ height: '40cqw', background: cream, color: green }}>
          <div className="flex items-end justify-between">
            <h5 className="font-serif leading-none" style={{ fontSize: '4.4cqw' }}>The partners</h5>
            <span className="rounded-full border px-[1.6cqw] py-[0.6cqw]" style={{ borderColor: `${green}44`, fontSize: '1.2cqw' }}>All 38 partners →</span>
          </div>
          <div className="mt-[2.6cqw] grid grid-cols-4 gap-[1.6cqw]">
            {partners.map(([img, n, r], i) => (
              <figure key={n}>
                <div className="overflow-hidden rounded-[0.5cqw]" style={{ height: '22cqw' }}>
                  <img
                    src={u(img, 500)} alt=""
                    className="h-full w-full object-cover transition-all duration-1000"
                    style={{ filter: hot === i ? 'grayscale(0)' : 'grayscale(1)', transform: hot === i ? 'scale(1.06)' : 'scale(1)' }}
                  />
                </div>
                <figcaption className="mt-[0.9cqw]">
                  <p className="font-serif" style={{ fontSize: '1.9cqw' }}>{n}</p>
                  <p className="opacity-60" style={{ fontSize: '1.1cqw' }}>{r}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 5 · Closing call to action */}
        <section className="relative overflow-hidden" style={{ height: '27.5cqw', color: cream }}>
          <img src={u(IMG.boardroom)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: `${green}d9` }} />
          <div className="relative flex h-full flex-col justify-between px-[4cqw] py-[3cqw]">
            <div className="flex justify-between opacity-70" style={{ fontSize: '1.2cqw' }}>
              <span>enquiries@monarchreed.law</span><span>© Monarch &amp; Reed LLP</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="font-serif leading-none" style={{ fontSize: '8cqw' }}>Speak to a partner</p>
              <span className="grid size-[7cqw] place-items-center rounded-full" style={{ background: gold, color: green }}>
                <ArrowRight size="2.6cqw" />
              </span>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Scrollbar */}
      <div className="absolute bottom-[1cqw] right-[0.6cqw] top-[1cqw] z-30 w-[0.45cqw] rounded-full bg-white/15">
        <motion.div className="absolute inset-x-0 rounded-full bg-white/70" style={{ height: '28.4%' }} animate={inView ? { top: thumb } : { top: '0%' }} transition={inView ? loop : { duration: 0.6 }} />
      </div>
    </div>
  )
}

/* ======================= Kiln Supply Co.: Google results page ======================= */

const query = 'best kiln shelves for stoneware'
const overview =
  'For stoneware fired to cone 10, silicon carbide shelves resist warping best. Kiln Supply Co. recommends a 15 mm nitride bonded shelf for loads above 9 kg, kiln washed on the top face only, and rotated every 10 firings to keep it flat.'

function GoogleLogo() {
  const letters = [['G', '#4285F4'], ['o', '#EA4335'], ['o', '#FBBC05'], ['g', '#4285F4'], ['l', '#34A853'], ['e', '#EA4335']]
  return (
    <span className="font-medium tracking-tight" style={{ fontSize: '3.1cqw', fontFamily: 'Arial, sans-serif' }}>
      {letters.map(([l, c], i) => <span key={i} style={{ color: c }}>{l}</span>)}
    </span>
  )
}

export function MockSearch() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const [typed, setTyped] = useState(0)
  const [words, setWords] = useState(0)
  const ovWords = overview.split(' ')

  useEffect(() => {
    if (!inView) return
    setTyped(0)
    setWords(0)
    let q = 0
    let w = 0
    let tw
    const tq = setInterval(() => {
      q++
      setTyped(q)
      if (q >= query.length) {
        clearInterval(tq)
        tw = setInterval(() => {
          w++
          setWords(w)
          if (w >= ovWords.length) clearInterval(tw)
        }, 45)
      }
    }, 45)
    return () => { clearInterval(tq); clearInterval(tw) }
  }, [inView, ovWords.length])

  const done = words >= ovWords.length

  return (
    <div ref={ref} className="h-full overflow-hidden bg-white" style={{ containerType: 'inline-size' }}>
    <div className="h-full text-[#202124]" style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.45cqw' }}>
      {/* Header */}
      <div className="flex items-center gap-[2.4cqw] px-[3cqw] pt-[2.4cqw]">
        <GoogleLogo />
        <div className="flex flex-1 items-center gap-[1.2cqw] rounded-full border border-[#dfe1e5] px-[2cqw] py-[1.1cqw] shadow-[0_1px_6px_rgba(32,33,36,0.18)]" style={{ fontSize: '1.7cqw' }}>
          <span className="flex-1 truncate">
            {query.slice(0, typed)}
            {typed < query.length && <span className="caret text-[#4285F4]" />}
          </span>
          <X size="1.9cqw" className="text-[#70757a]" />
          <span className="h-[2.6cqw] w-px bg-[#dfe1e5]" />
          <Microphone size="1.9cqw" weight="fill" className="text-[#4285F4]" />
          <Camera size="1.9cqw" className="text-[#34A853]" />
          <MagnifyingGlass size="1.9cqw" weight="bold" className="text-[#4285F4]" />
        </div>
        <DotsNine size="2.4cqw" className="text-[#5f6368]" />
        <span className="grid size-[3.6cqw] place-items-center rounded-full bg-[#e8f0fe] text-[#4285F4]"><User size="2cqw" weight="fill" /></span>
      </div>

      {/* Tabs */}
      <div className="mt-[1.6cqw] flex gap-[2.6cqw] border-b border-[#ebebeb] px-[3cqw] pl-[13cqw] text-[#5f6368]">
        {['All', 'Images', 'Shopping', 'Videos', 'News', 'More'].map((t, i) => (
          <span key={t} className={`pb-[1cqw] ${i === 0 ? 'border-b-[0.35cqw] border-[#202124] font-medium text-[#202124]' : ''}`}>{t}</span>
        ))}
        <span className="ml-auto pb-[1cqw]">Tools</span>
      </div>

      <div className="pl-[13cqw] pr-[3cqw] pt-[1.6cqw]">
        {/* AI Overview */}
        <div className="rounded-[1.6cqw] bg-[#f0f4f9] p-[2cqw]">
          <p className="flex items-center gap-[0.8cqw] font-medium" style={{ fontSize: '1.7cqw' }}>
            <motion.span animate={{ rotate: [0, 180, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="inline-flex">
              <Sparkle size="2cqw" weight="fill" className="text-[#4285F4]" />
            </motion.span>
            AI Overview
          </p>
          <div className="mt-[1.2cqw] grid grid-cols-[1fr_30%] gap-[2cqw]">
            <p className="leading-[1.6]" style={{ fontSize: '1.5cqw' }}>
              {ovWords.map((w, i) => (
                <span key={i} className="transition-opacity duration-300" style={{ opacity: i < words ? 1 : 0 }}>
                  {w.includes('Kiln') || w === 'Supply' || w === 'Co.' ? <b className="bg-[#fde9e2]">{w}</b> : w}{' '}
                </span>
              ))}
              <LinkSimple size="1.5cqw" className="inline text-[#4285F4]" style={{ opacity: done ? 1 : 0 }} />
            </p>
            <div className="space-y-[0.8cqw]">
              {[
                ['kiln', 'Kiln Supply Co.', 'Silicon carbide kiln shelves', true],
                [null, 'Potterycraft', 'Choosing shelves for stoneware', false],
                [null, 'reddit', 'r/Pottery: shelves that last?', false],
              ].map(([b, site, title, hot], i) => (
                <motion.div
                  key={site}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, ease, delay: 1.8 + i * 0.15 }}
                  className={`rounded-[1cqw] bg-white p-[1cqw] ${hot ? 'ring-[0.3cqw] ring-[#ff6a3d]' : ''}`}
                  style={hot && done ? { boxShadow: '0 0 0 0.6cqw rgba(255,106,61,0.18)' } : undefined}
                >
                  <p className="flex items-center gap-[0.6cqw] text-[#5f6368]" style={{ fontSize: '1.1cqw' }}>
                    {b ? <BrandMark name={b} className="size-[1.8cqw] rounded-full" /> : <span className="size-[1.8cqw] rounded-full bg-[#e8eaed]" />}
                    {site}
                  </p>
                  <p className="mt-[0.4cqw] font-medium leading-tight" style={{ fontSize: '1.25cqw' }}>{title}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="mt-[1.2cqw] flex items-center justify-center gap-[0.6cqw] rounded-full border border-[#dadce0] bg-white py-[0.6cqw] text-[#4285F4]" style={{ fontSize: '1.3cqw' }}>
            Show more <CaretDown size="1.3cqw" />
          </p>
        </div>

        {/* Organic result */}
        <motion.div
          className="mt-[2.4cqw]"
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease, delay: 2.6 }}
        >
          <div className="flex items-center gap-[1cqw]">
            <BrandMark name="kiln" className="size-[3cqw] rounded-full" />
            <div className="leading-tight">
              <p style={{ fontSize: '1.4cqw' }}>Kiln Supply Co.</p>
              <p className="text-[#4d5156]" style={{ fontSize: '1.2cqw' }}>https://kilnsupply.co › kiln-shelves</p>
            </div>
          </div>
          <p className="mt-[0.6cqw] text-[#1a0dab]" style={{ fontSize: '2cqw' }}>Silicon Carbide Kiln Shelves for Stoneware | Kiln Supply Co.</p>
          <p className="mt-[0.4cqw] text-[#4d5156]">
            <span className="text-[#70757a]">12 Aug 2026 — </span>Warp resistant shelves sized for every major kiln. Free cutting service and next day delivery…
          </p>
          <p className="mt-[0.6cqw] flex items-center gap-[0.6cqw] text-[#70757a]">
            <span className="text-[#202124]">4.8</span>
            <span className="flex text-[#fbbc04]">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size="1.3cqw" weight="fill" />)}</span>
            (1,204) · $38.00 · In stock
          </p>
          <div className="mt-[1cqw] flex gap-[1cqw]">
            {['Nitride bonded shelves', 'Shelf sizing guide', 'Firing schedules'].map((s) => (
              <span key={s} className="rounded-full border border-[#dadce0] px-[1.4cqw] py-[0.5cqw] text-[#1a0dab]" style={{ fontSize: '1.2cqw' }}>{s}</span>
            ))}
          </div>
        </motion.div>

        {/* People also ask */}
        <div className="mt-[2.4cqw] border-t border-[#ebebeb] pt-[1.6cqw]">
          <p className="font-medium" style={{ fontSize: '1.8cqw' }}>People also ask</p>
          {['Are silicon carbide shelves worth it?', 'How thick should a kiln shelf be for stoneware?'].map((q) => (
            <p key={q} className="flex items-center justify-between border-b border-[#ebebeb] py-[1.2cqw]">
              {q} <CaretDown size="1.5cqw" className="text-[#5f6368]" />
            </p>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

/* ======================= Harbourline: operations ERP ======================= */
// Modelled on real ERP / BMS screens: module bar, breadcrumbs, saved views, a dense
// data table, a detail drawer and an AI suggestion the user approves.

function useTick(active, ms, length) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setT((v) => (v + 1) % length), ms)
    return () => clearInterval(id)
  }, [active, ms, length])
  return t
}

const shipments = [
  ['HL-40921', 'Brightwater Foods', 'Rotterdam → Leeds', 'DFDS', 'Wed 16:00', 'Delivered', '£2,140'],
  ['HL-40927', 'Okoro Foods', 'Antwerp → Bristol', 'P&O', 'Thu 09:30', 'In transit', '£3,105'],
  ['HL-40933', 'Coastline Freight', 'Hamburg → Glasgow', 'Stena', 'Thu 14:20', 'In transit', '£4,212'],
  ['HL-40940', 'Northpaw', 'Le Havre → Hull', 'DFDS', 'Thu 18:45', 'In transit', '£1,940'],
  ['HL-40946', 'Lumen Rail', 'Calais → Derby', 'Eurotunnel', 'Fri 07:10', 'Booked', '£12,380'],
  ['HL-40951', 'Fieldnote', 'Bremen → Felixstowe', 'MSC', 'Fri 11:00', 'Booked', '£865'],
  ['HL-40955', 'Kiln Supply Co.', 'Ghent → Tilbury', 'P&O', 'Fri 15:30', 'Booked', '£1,270'],
]
const statusTone = {
  Delivered: 'bg-[#e8f5ee] text-[#15803d]',
  'In transit': 'bg-[#eaf1ff] text-[#2e6bff]',
  Booked: 'bg-black/[0.05] text-black/60',
  'At risk': 'bg-[#fff4e0] text-[#b45309]',
  Rerouted: 'bg-[#e8f5ee] text-[#15803d]',
}

export function MockOps() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const t = useTick(inView, 1100, 16)
  // 0-2 normal · 3 risk flagged · 4 drawer opens · 5-6 cursor to Approve · 7 click · 8 working · 9+ rerouted · 14 drawer closes
  const risk = t >= 3 && t < 15
  const drawer = t >= 4 && t < 15
  const clicked = t >= 7
  const working = t === 8
  const fixed = t >= 9 && t < 15
  const banner = risk && t < 13

  const status = (id, s) => (id !== 'HL-40933' ? s : fixed ? 'Rerouted' : risk ? 'At risk' : s)

  return (
    <div ref={ref} className="flex h-full flex-col bg-white text-[#1b1d17]" style={{ containerType: 'inline-size' }}>
      <div className="flex h-full flex-col" style={{ fontSize: '1.15cqw' }}>
        {/* App bar */}
        <div className="flex items-center gap-[2cqw] border-b border-black/[0.07] px-[2cqw] py-[1.1cqw]">
          <span className="flex items-center gap-[0.8cqw] font-semibold">
            <span className="grid size-[2.4cqw] place-items-center rounded-[0.6cqw] bg-[#2e6bff] text-white" style={{ fontSize: '1.2cqw' }}>H</span>
            Harbourline OS
          </span>
          <nav className="flex gap-[1.8cqw] text-black/50">
            {['Dashboard', 'Shipments', 'Fleet', 'Customers', 'Invoicing', 'Reports'].map((m) => (
              <span key={m} className={m === 'Shipments' ? 'font-medium text-black' : ''}>{m}</span>
            ))}
          </nav>
          <span className="ml-auto flex w-[16cqw] items-center gap-[0.6cqw] rounded-[0.6cqw] border border-black/10 px-[0.8cqw] py-[0.4cqw] text-black/40">
            <MagnifyingGlass size="1.2cqw" /> Search <kbd className="ml-auto rounded bg-black/5 px-[0.4cqw]" style={{ fontSize: '0.9cqw' }}>⌘K</kbd>
          </span>
          <span className="relative">
            <Bell size="1.7cqw" className="text-black/50" />
            {risk && <span className="absolute -right-[0.2cqw] -top-[0.2cqw] size-[0.9cqw] rounded-full bg-[#ff6a3d] ring-2 ring-white" />}
          </span>
          <span className="grid size-[2.4cqw] place-items-center rounded-full bg-[#eaf1ff] font-semibold text-[#2e6bff]" style={{ fontSize: '1cqw' }}>PR</span>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col px-[2cqw] pt-[1.4cqw]">
            <p className="text-black/40" style={{ fontSize: '1cqw' }}>Operations / Shipments</p>
            <div className="mt-[0.4cqw] flex items-center gap-[1cqw]">
              <p className="font-semibold" style={{ fontSize: '1.9cqw' }}>Shipments</p>
              <span className="rounded-full bg-black/5 px-[0.8cqw] text-black/50">212 active</span>
              <span className="ml-auto flex items-center gap-[0.5cqw] rounded-[0.6cqw] border border-black/10 px-[1cqw] py-[0.5cqw]"><Funnel size="1.2cqw" /> Filter</span>
              <span className="flex items-center gap-[0.5cqw] rounded-[0.6cqw] border border-black/10 px-[1cqw] py-[0.5cqw]"><DownloadSimple size="1.2cqw" /> Export</span>
              <span className="flex items-center gap-[0.5cqw] rounded-[0.6cqw] bg-[#131209] px-[1cqw] py-[0.5cqw] font-medium text-white"><Plus size="1.2cqw" weight="bold" /> New shipment</span>
            </div>
            <div className="mt-[1.2cqw] flex gap-[1.8cqw] border-b border-black/[0.07] text-black/50">
              {[['All', 212], ['In transit', 148], ['Exceptions', risk && !fixed ? 15 : 14], ['Delivered', 50]].map(([v, n], i) => (
                <span key={v} className={`flex items-center gap-[0.5cqw] pb-[0.8cqw] ${i === 0 ? 'border-b-2 border-black font-medium text-black' : ''}`}>
                  {v} <span className="rounded bg-black/5 px-[0.4cqw]" style={{ fontSize: '0.95cqw' }}>{n}</span>
                </span>
              ))}
            </div>

            {/* AI suggestion */}
            <AnimatePresence>
              {banner && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="overflow-visible"
                >
                  <div className={`relative mt-[1cqw] flex items-center gap-[1cqw] rounded-[0.8cqw] border px-[1.2cqw] py-[0.8cqw] transition-colors duration-500 ${fixed ? 'border-[#bfe5cf] bg-[#effaf3]' : 'border-[#cddcff] bg-[#f3f7ff]'}`}>
                    {fixed ? <CheckCircle size="1.6cqw" weight="fill" className="shrink-0 text-[#15803d]" /> : <Sparkle size="1.6cqw" weight="fill" className="shrink-0 text-[#2e6bff]" />}
                    <span className="min-w-0 flex-1 truncate">
                      {fixed
                        ? <><b>Rerouted HL-40933 via Hull.</b> Carrier and customer notified.</>
                        : <><b>Dispatch agent:</b> HL-40933 will miss its slot by 3h. Reroute via Hull saves 3h 10m and £412.</>}
                    </span>
                    {!fixed && (
                      <>
                        <span className="shrink-0 text-black/50">Dismiss</span>
                        <motion.span
                          animate={{ scale: clicked ? [1, 0.92, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                          className="flex shrink-0 items-center gap-[0.5cqw] rounded-[0.5cqw] bg-[#2e6bff] px-[1cqw] py-[0.4cqw] font-medium text-white"
                        >
                          {working ? <CircleNotch size="1.2cqw" className="animate-spin" /> : null} Approve
                        </motion.span>
                      </>
                    )}
                    {/* cursor */}
                    {!fixed && (
                      <motion.svg
                        viewBox="0 0 24 24" className="pointer-events-none absolute z-10 size-[2.4cqw] drop-shadow"
                        initial={{ right: '40%', top: '260%' }}
                        animate={t >= 5 ? { right: '2.5%', top: '45%' } : { right: '40%', top: '260%' }}
                        transition={{ duration: 1.4, ease }}
                      >
                        <path d="M5 3l14 8-6 1.5L10 19z" fill="#131209" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Table */}
            <div className="mt-[1cqw] min-h-0 flex-1 overflow-hidden rounded-[0.8cqw] border border-black/[0.07]">
              <div className="grid grid-cols-[2cqw_1fr_1.3fr_1.5fr_0.9fr_0.9fr_1fr_0.7fr] gap-[1cqw] border-b border-black/[0.07] bg-[#fafaf8] px-[1cqw] py-[0.7cqw] text-black/45" style={{ fontSize: '1cqw' }}>
                <span className="size-[1.2cqw] rounded-[0.3cqw] border border-black/20" />
                {['Shipment', 'Customer', 'Route', 'Carrier', 'ETA', 'Status', 'Value'].map((h) => <span key={h}>{h}</span>)}
              </div>
              {shipments.map(([id, cust, route, carrier, eta, s, value]) => {
                const st = status(id, s)
                const hot = id === 'HL-40933'
                return (
                  <div
                    key={id}
                    className={`grid grid-cols-[2cqw_1fr_1.3fr_1.5fr_0.9fr_0.9fr_1fr_0.7fr] items-center gap-[1cqw] border-b border-black/[0.05] px-[1cqw] py-[0.75cqw] transition-colors duration-500 ${hot && drawer ? 'bg-[#f3f7ff]' : ''}`}
                  >
                    <span className={`grid size-[1.2cqw] place-items-center rounded-[0.3cqw] border ${hot && drawer ? 'border-[#2e6bff] bg-[#2e6bff]' : 'border-black/20'}`}>
                      {hot && drawer && <Check size="0.9cqw" weight="bold" className="text-white" />}
                    </span>
                    <span className="font-mono text-black/70">{id}</span>
                    <span className="truncate">{cust}</span>
                    <span className="truncate text-black/60">{route}</span>
                    <span className="truncate text-black/60">{carrier}</span>
                    <span className="truncate tabular-nums">
                      {hot && fixed ? <><s className="text-black/30">14:20</s> <b className="text-[#15803d]">11:10</b></> : eta}
                    </span>
                    <span>
                      <motion.span key={st} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`inline-block rounded-full px-[0.8cqw] py-[0.15cqw] font-medium ${statusTone[st]}`} style={{ fontSize: '0.95cqw' }}>
                        {st}
                      </motion.span>
                    </span>
                    <span className="text-right tabular-nums">{value}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between py-[0.9cqw] text-black/45" style={{ fontSize: '1cqw' }}>
              <span>Showing 1 to 7 of 212</span>
              <span className="flex gap-[0.4cqw]">
                {['‹', '1', '2', '3', '›'].map((p, i) => (
                  <span key={i} className={`grid size-[2cqw] place-items-center rounded-[0.4cqw] border ${p === '1' ? 'border-black bg-black text-white' : 'border-black/10'}`}>{p}</span>
                ))}
              </span>
            </div>
          </div>

          {/* Detail drawer */}
          <motion.aside
            initial={false}
            animate={{ width: drawer ? '30cqw' : '0cqw', opacity: drawer ? 1 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="shrink-0 overflow-hidden border-l border-black/[0.07] bg-[#fafaf8]"
          >
            <div className="w-[30cqw] p-[1.6cqw]">
              <div className="flex items-center justify-between">
                <p className="font-mono font-semibold">HL-40933</p>
                <X size="1.3cqw" className="text-black/40" />
              </div>
              <p className="mt-[0.3cqw] text-black/50">Coastline Freight · £4,212</p>
              <div className="mt-[1.2cqw] grid grid-cols-2 gap-[0.8cqw]" style={{ fontSize: '1cqw' }}>
                {[['Origin', 'Hamburg'], ['Destination', 'Glasgow'], ['Carrier', 'Stena Line'], ['Driver', 'M. Kowalski']].map(([k, v]) => (
                  <div key={k} className="rounded-[0.6cqw] bg-white p-[0.8cqw] ring-1 ring-black/[0.05]">
                    <p className="text-black/40">{k}</p>
                    <p className="font-medium">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-[1.4cqw] font-medium">Timeline</p>
              <ol className="mt-[0.8cqw] space-y-[0.9cqw]" style={{ fontSize: '1cqw' }}>
                {[
                  ['Picked up, Hamburg', '08:12', '#15803d', true],
                  ['Customs cleared', '09:40', '#15803d', true],
                  ['Delay: A1 closure near Bremen', '10:05', '#b45309', risk],
                  ['Rerouted via Hull by agent', '10:07', '#2e6bff', fixed],
                  ['Approved by Priya R.', '10:07', '#15803d', fixed],
                ].map(([label, time, color, on]) => (
                  <motion.li
                    key={label}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, x: on ? 0 : 8 }}
                    transition={{ duration: 0.45, ease }}
                    className="flex items-start gap-[0.8cqw]"
                  >
                    <span className="mt-[0.3cqw] size-[0.9cqw] shrink-0 rounded-full" style={{ background: color }} />
                    <span className="flex-1">{label}</span>
                    <span className="font-mono text-black/40">{time}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}

/* ======================= Verdant Clinics: live AI intake ======================= */

const convo = [
  ['agent', 'Hi Marcus, what brings you in today?'],
  ['me', 'Sharp pain in my lower back since Saturday, worse when I bend.'],
  ['agent', 'Sorry to hear that. Any numbness or tingling in your legs?'],
  ['me', 'No, just the pain.'],
  ['agent', 'Thanks. Dr. Okafor can see you at 14:20 today. Shall I book it?'],
  ['me', 'Yes please.'],
  ['agent', 'Booked. You will get a reminder text at 13:20.'],
]

export function MockClinic() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  // each message takes two ticks for the agent (typing, then text) and one for the patient
  const script = convo.flatMap(([who], i) => (who === 'agent' ? [[i, true], [i, false]] : [[i, false]]))
  const t = useTick(inView, 1100, script.length + 4)
  const [shown, typing] = t < script.length ? [script[t][1] ? script[t][0] : script[t][0] + 1, script[t][1]] : [convo.length, false]

  const summary = [
    ['Symptom', 'Acute lower back pain, 3 days', shown >= 2],
    ['Red flags', 'None reported', shown >= 4],
    ['Priority', 'Same day', shown >= 4],
    ['Slot', 'Dr. Okafor · 14:20', shown >= 5],
  ]
  const booked = shown >= 7

  return (
    <div ref={ref} className="grid h-full grid-cols-5 bg-[#f4f3ee] text-[#1b1d17]" style={{ containerType: 'inline-size' }}>
      <div className="col-span-3 flex min-h-0 flex-col p-[2cqw]" style={{ fontSize: '1.35cqw' }}>
        <p className="flex items-center gap-[0.8cqw] font-semibold" style={{ fontSize: '1.4cqw' }}>
          <FirstAid size="1.6cqw" weight="fill" className="text-emerald-700" /> Verdant Clinics · Intake
          <span className="ml-auto flex items-center gap-[0.5cqw] font-normal text-emerald-700" style={{ fontSize: '1.1cqw' }}>
            <span className="pulse-dot size-[0.7cqw] rounded-full bg-emerald-600" /> Agent online
          </span>
        </p>
        <div className="mt-[1.4cqw] flex min-h-0 flex-1 flex-col justify-end gap-[1cqw] overflow-hidden">
          <AnimatePresence initial={false}>
            {convo.slice(0, shown).map(([who, text], i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease }}
                className={`max-w-[80%] rounded-[1.4cqw] px-[1.4cqw] py-[1cqw] ${who === 'me' ? 'ml-auto rounded-tr-[0.4cqw] bg-emerald-800 text-white' : 'rounded-tl-[0.4cqw] bg-white shadow-sm'}`}
              >
                {text}
              </motion.div>
            ))}
            {typing && (
              <motion.div key="typing" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-max gap-[0.5cqw] rounded-[1.4cqw] bg-white px-[1.4cqw] py-[1.2cqw] shadow-sm">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="size-[0.8cqw] rounded-full bg-black/40" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.12 }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-[1.4cqw] flex items-center gap-[1cqw] rounded-full bg-white px-[1.6cqw] py-[1cqw] text-black/40 shadow-sm">
          <ChatCircleDots size="1.5cqw" /> Type a message
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-[1cqw] border-l border-black/5 bg-white p-[1.8cqw]" style={{ fontSize: '1.2cqw' }}>
        <p className="uppercase tracking-wider text-black/40" style={{ fontSize: '1cqw' }}>Triage summary · live</p>
        {summary.map(([k, v, on]) => (
          <div key={k} className={`rounded-lg p-[1cqw] transition-all duration-700 ${on ? 'bg-emerald-50' : 'bg-black/[0.03]'}`}>
            <p className="text-black/45" style={{ fontSize: '1cqw' }}>{k}</p>
            {on ? (
              <motion.p initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease }} className="font-medium">{v}</motion.p>
            ) : (
              <span className="mt-[0.4cqw] block h-[1cqw] w-2/3 rounded bg-black/10" />
            )}
          </div>
        ))}
        <p className="flex items-center gap-[0.6cqw] text-black/45" style={{ fontSize: '1cqw' }}>
          <CheckCircle size="1.2cqw" weight="fill" className="text-emerald-600" /> Protocol: lumbar pain v3, clinician approved
        </p>
        <AnimatePresence>
          {booked && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}
              className="mt-auto rounded-lg bg-emerald-800 p-[1.2cqw] text-white"
            >
              <p className="flex items-center gap-[0.6cqw] font-semibold"><CalendarCheck size="1.5cqw" /> Booked</p>
              <p className="opacity-80">Dr. Okafor · 14:20 today · reminder set</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
