// Project enquiry form. Submissions go to a Google Sheet through Apps Script
// (src/lib/submit.js and docs/FORM_SETUP.md).
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  User, SquaresFour, NotePencil, Code, Robot, FlowArrow, Browser, MagnifyingGlass, Database,
  ArrowRight, CheckCircle, WarningCircle, CircleNotch,
} from '@phosphor-icons/react'
import { submitForm } from '../lib/submit'
import { ease } from './ui'

const services = [
  [Code, 'Custom software'],
  [Robot, 'AI agents'],
  [FlowArrow, 'AI automation and integration'],
  [Browser, 'Website'],
  [MagnifyingGlass, 'SEO and AI search'],
  [Database, 'STAT6 BMS'],
]
const timelines = ['As soon as possible', 'In 1 to 3 months', 'In 3 to 6 months', 'Just exploring']
const sources = ['Google search', 'ChatGPT or AI search', 'LinkedIn', 'Instagram', 'Referral', 'Event', 'Other']
const MAX = 2000
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

const input =
  'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-ink/35 outline-none transition-all duration-500 ease-fluid focus:border-ink/40 focus:ring-4 focus:ring-black/[0.04]'

function Group({ Icon, title }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Icon size={14} className="text-ink/45" />
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink/55">{title}</span>
      <span className="h-px flex-1 bg-black/10" />
    </div>
  )
}

function Field({ label, optional, error, children }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label} {optional && <span className="text-xs font-normal text-ink/45">(optional)</span>}
      {children}
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-sm font-normal text-red-600">
          <WarningCircle /> {error}
        </span>
      )}
    </label>
  )
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all duration-500 ease-fluid active:scale-[0.98] ${
        selected ? 'border-ink bg-ink text-white' : 'border-black/10 bg-white text-ink/75 hover:border-black/30'
      }`}
    >
      {children}
    </button>
  )
}

export default function EnquiryForm() {
  const [v, setV] = useState({
    name: '', email: '', phone: '', company: '', website: '',
    services: [], budget: '', timeline: '', details: '', source: '', consent: false,
    confirm_url: '', // honeypot: real people never see or fill this
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [failMsg, setFailMsg] = useState('')

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e }))
  const toggleService = (s) => setV((p) => ({ ...p, services: p.services.includes(s) ? p.services.filter((x) => x !== s) : [...p.services, s] }))

  const progress = useMemo(() => {
    const checks = [v.name.trim(), emailOk(v.email), v.phone.trim(), v.company.trim(), v.services.length, v.budget.trim(), v.timeline, v.details.trim().length >= 20, v.consent]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [v])

  const validate = () => {
    const e = {}
    if (!v.name.trim()) e.name = 'Please enter your name.'
    if (!emailOk(v.email)) e.email = 'Enter a valid work email, like ananya@company.com.'
    if (!v.services.length) e.services = 'Pick at least one service.'
    if (v.details.trim().length < 20) e.details = 'Tell us a little more, at least 20 characters.'
    if (!v.consent) e.consent = 'Please agree so we can reply to you.'
    return e
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      // bots fill the hidden honeypot field: pretend it worked and send nothing
      if (!v.confirm_url) await submitForm('enquiry', v)
      setStatus('done')
    } catch (err) {
      setFailMsg(
        err.message === 'not-configured'
          ? 'The form is not connected yet. Please email aaru@statsix.com instead.'
          : 'We could not send your enquiry. Please try again, or email aaru@statsix.com.',
      )
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="flex h-full flex-col items-start justify-center rounded-3xl border border-black/10 bg-paper p-8"
      >
        <CheckCircle size={40} weight="duotone" className="text-mint" />
        <h3 className="mt-6 text-3xl font-semibold tracking-tight">Enquiry received</h3>
        <p className="mt-3 text-ink/65">
          Thanks{v.name ? `, ${v.name.split(' ')[0]}` : ''}. A STAT6 lead will reply to {v.email} within one business day.
        </p>
      </motion.div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-black/10 bg-paper p-6 md:p-8" aria-busy={status === 'sending'}>
      {/* progress */}
      <div className="flex items-center gap-3 text-xs text-ink/55">
        Form progress
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-black/10">
          <motion.span className="block h-full rounded-full bg-ink" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease }} />
        </span>
        <span className="w-9 text-right font-medium tabular-nums text-ink">{progress}%</span>
      </div>

      <Group Icon={User} title="About you" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input name="name" autoComplete="name" value={v.name} onChange={set('name')} placeholder="Ananya Iyer" aria-invalid={!!errors.name} className={`${input} ${errors.name ? 'border-red-400' : 'border-black/10'}`} />
        </Field>
        <Field label="Work email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" value={v.email} onChange={set('email')} placeholder="ananya@company.com" aria-invalid={!!errors.email} className={`${input} ${errors.email ? 'border-red-400' : 'border-black/10'}`} />
        </Field>
        <Field label="Phone" optional>
          <input name="phone" type="tel" autoComplete="tel" value={v.phone} onChange={set('phone')} placeholder="+91 98450 21734" className={`${input} border-black/10`} />
        </Field>
        <Field label="Company" optional>
          <input name="company" autoComplete="organization" value={v.company} onChange={set('company')} placeholder="Company or project name" className={`${input} border-black/10`} />
        </Field>
      </div>
      <Field label="Current website" optional>
        <input name="website" type="url" inputMode="url" value={v.website} onChange={set('website')} placeholder="https://" className={`${input} border-black/10`} />
      </Field>

      <Group Icon={SquaresFour} title="What you need" />
      <fieldset>
        <legend className="text-sm font-medium">Services <span className="text-xs font-normal text-ink/45">(pick all that apply)</span></legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {services.map(([Icon, s]) => (
            <Chip key={s} selected={v.services.includes(s)} onClick={() => toggleService(s)}>
              <Icon size={15} /> {s}
            </Chip>
          ))}
        </div>
        <input name="services" className="sr-only" tabIndex={-1} aria-hidden readOnly value={v.services.join(',')} />
        {errors.services && <span className="mt-1.5 flex items-center gap-1 text-sm text-red-600"><WarningCircle /> {errors.services}</span>}
      </fieldset>
      <Field label="Budget" optional>
        <input name="budget" value={v.budget} onChange={set('budget')} placeholder="For example ₹8 lakh, $25k, or open to suggestions" className={`${input} border-black/10`} />
      </Field>
      <fieldset>
        <legend className="text-sm font-medium">When do you want to launch?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {timelines.map((t) => (
            <Chip key={t} selected={v.timeline === t} onClick={() => setV((s) => ({ ...s, timeline: s.timeline === t ? '' : t }))}>{t}</Chip>
          ))}
        </div>
      </fieldset>

      <Group Icon={NotePencil} title="Your project" />
      <Field label="Project details" error={errors.details}>
        <textarea
          name="details"
          rows={5}
          maxLength={MAX}
          value={v.details}
          onChange={set('details')}
          placeholder="What are you building, who is it for, and what does success look like?"
          aria-invalid={!!errors.details}
          className={`${input} resize-y ${errors.details ? 'border-red-400' : 'border-black/10'}`}
        />
        <span className="mt-1 block text-right text-xs font-normal tabular-nums text-ink/45">{v.details.length} / {MAX}</span>
      </Field>
      <Field label="How did you hear about us?" optional>
        <select name="source" value={v.source} onChange={set('source')} className={`${input} border-black/10`}>
          <option value="">Choose one</option>
          {sources.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>

      {/* honeypot, hidden from people and screen readers */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>Confirm URL<input name="confirm_url" tabIndex={-1} autoComplete="off" value={v.confirm_url} onChange={set('confirm_url')} /></label>
      </div>

      <label className="flex items-start gap-3 text-sm text-ink/65">
        <input name="consent" type="checkbox" checked={v.consent} onChange={set('consent')} className="mt-0.5 size-4 shrink-0 accent-[#131209]" />
        <span>
          I agree that STAT6 may contact me about this enquiry, as described in the{' '}
          <a href="/privacy.html" className="font-medium text-ink underline underline-offset-2">privacy policy</a>.
        </span>
      </label>
      {errors.consent && <span className="-mt-3 flex items-center gap-1 text-sm text-red-600"><WarningCircle /> {errors.consent}</span>}

      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <WarningCircle size={18} className="mt-px shrink-0" /> {failMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-base font-semibold text-white transition-all duration-500 ease-fluid hover:bg-black active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'sending' ? (
          <><CircleNotch size={18} className="animate-spin" /> Sending</>
        ) : (
          <>Send enquiry <span className="grid size-6 place-items-center rounded-full bg-white/15"><ArrowRight size={14} weight="bold" /></span></>
        )}
      </button>
      <p className="text-center text-xs text-ink/50">Protected by a spam filter. We never share your details.</p>
    </form>
  )
}
