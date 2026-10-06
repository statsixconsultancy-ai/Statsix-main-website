import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import {
  SquaresFour, Robot, FlowArrow, Code, Trophy, MagnifyingGlass, Plus, ArrowRight,
  MapTrifold, Hammer, Pulse, CheckCircle, WarningCircle,
} from '@phosphor-icons/react'
import { BrandMark } from './Logos'
import EnquiryForm from './EnquiryForm'
import { Eyebrow, Reveal, SpotlightCard, CountUp, VelocityText, Magnet, btnPrimary, ease } from './ui'

/* ---------- Client strip ---------- */
const clients = [['harbourline', 'Harbourline'], ['verdant', 'Verdant Clinics'], ['monarch', 'Monarch & Reed'], ['kiln', 'Kiln Supply Co.'], ['northpaw', 'Northpaw'], ['lumen', 'Lumen Rail']]

export function ClientStrip() {
  return (
    <section aria-label="Clients" className="border-y border-black/5 py-10">
      <p className="mb-6 text-center text-sm text-ink/55">Operators who run on STAT6</p>
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max gap-16 pr-16" style={{ '--marquee-speed': '45s' }}>
          {[...clients, ...clients, ...clients, ...clients].map(([b, c], i) => (
            <span key={i} aria-hidden={i >= clients.length} className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-ink/55 grayscale transition-all duration-700 ease-fluid hover:text-ink hover:grayscale-0">
              <BrandMark name={b} className="size-8 rounded-lg" /> {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */
export const faqs = [
  ['What does a typical project cost?', 'Most builds land between $38,000 and $240,000 depending on scope. You get a fixed price after the two week mapping phase, so the number does not move.'],
  ['How long until we are live?', 'Our median is 11 weeks to production. Websites and SEO programmes usually start showing results within 6 to 8 weeks.'],
  ['Do we own the code?', 'Yes. Source code, infrastructure and IP transfer to you from the first commit. No lock in, no licence fees to us.'],
  ['Can you work with our existing tools?', 'Usually yes. We integrate with ERPs, CRMs, accounting platforms and custom databases, and only replace what is actually slowing you down.'],
  ['Are AI agents safe for our data?', 'Agents run in your cloud account with scoped permissions, human approval steps for sensitive actions and a full audit log of every decision.'],
  ['What is GEO and AEO?', 'Generative engine optimisation and answer engine optimisation. They make your business the source that ChatGPT, Perplexity and Google AI Overviews cite when people ask about your category.'],
  ['What happens after launch?', 'A named engineer stays on your account. We monitor uptime, tune agents and ship improvements on a monthly retainer you can cancel with 30 days notice.'],
  ['Do you work with smaller companies?', 'Yes, if the problem is real. Our smallest client has 9 staff. Our largest runs 2,100 people across four countries.'],
]

export function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="px-4 py-32 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow tone={4}>FAQ</Eyebrow>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">Straight answers</h2>
          <p className="mt-6 text-ink/60">
            Something else on your mind? <a href="#contact" className="font-medium text-blue underline-offset-4 hover:underline">Ask us directly</a>.
          </p>
        </Reveal>
        <div className="space-y-3 lg:col-span-8">
          {faqs.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <Reveal key={q} delay={i * 0.04} amount={0.6}>
                <div className={`rounded-2xl border transition-all duration-700 ease-fluid ${isOpen ? 'border-black/20 bg-white' : 'border-black/10 hover:bg-black/[0.03]'}`}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-6 p-6 text-left text-lg font-medium"
                    >
                      {q}
                      <Plus size={20} className={`shrink-0 text-blue transition-transform duration-700 ease-fluid ${isOpen ? 'rotate-45' : ''}`} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-ink/60">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Contact / final CTA ---------- */
export function Contact() {
  return (
    <section id="contact" className="px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-black/10 bg-white p-6 md:p-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Start a project</Eyebrow>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Let us build what your business actually needs
          </h2>
          <p className="mt-6 text-lg text-ink/60">
            Tell us about your project. You get a reply within one business day with next steps, a rough scope and a price range,
            whether or not you work with us.
          </p>
          <ul className="mt-8 space-y-3 text-ink/70">
            {['Fixed price after mapping, never hourly', 'You own all code and IP', 'Reply within one business day'].map((t) => (
              <li key={t} className="flex items-center gap-3"><CheckCircle weight="fill" className="text-mint" /> {t}</li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-ink/55">
            Prefer email? <a href="mailto:aaru@statsix.com" className="font-medium text-ink underline underline-offset-4">aaru@statsix.com</a>
          </p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Footer with parallax wordmark ---------- */
export function Footer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['60%', '0%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1])
  return (
    <footer ref={ref} className="overflow-hidden border-t border-black/5 px-4 pt-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-sm text-ink/60">
            STAT6 builds business management systems, AI agents and websites for companies that are ready to stop patching.
          </p>
          <a href="mailto:aaru@statsix.com" className="mt-4 inline-block text-sm font-medium text-ink/70 transition-colors duration-700 ease-fluid hover:text-ink">
            aaru@statsix.com
          </a>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 text-sm md:col-span-2">
          <ul className="space-y-3 text-ink/60">
            {[['Services', '#services'], ['Work', '#work'], ['Process', '#process'], ['FAQ', '#faq']].map(([l, h]) => (
              <li key={h}><a href={h} className="transition-colors duration-700 ease-fluid hover:text-ink">{l}</a></li>
            ))}
          </ul>
          <ul className="space-y-3 text-ink/60">
            <li><a href="/privacy.html" className="transition-colors duration-700 ease-fluid hover:text-ink">Privacy policy</a></li>
            <li><a href="/terms.html" className="transition-colors duration-700 ease-fluid hover:text-ink">Terms of service</a></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-16 flex max-w-7xl justify-between border-t border-black/5 py-6 text-xs text-ink/55">
        <span>© 2026 STAT6. All rights reserved.</span>
        <a href="#top" className="hover:text-ink">Back to top ↑</a>
      </div>
      <motion.img
        src="/stat6-logo.png"
        alt=""
        aria-hidden
        style={{ y, opacity }}
        className="mx-auto w-full max-w-7xl"
      />
      <div className="mx-auto flex max-w-7xl justify-end py-5 text-xs text-ink/55">
        <p>
          Designed and built by{' '}
          <a
            href="https://www.instagram.com/theleveragegame/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline decoration-black/20 underline-offset-4 transition-colors duration-700 ease-fluid hover:decoration-ink"
          >
            Aarupadaiyar KJ
          </a>
        </p>
      </div>
    </footer>
  )
}
