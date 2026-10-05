import { Suspense, lazy, useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import Lenis from 'lenis'
import Nav from './components/Nav'
import Hero, { ProductReveal } from './components/Hero'
// Below the fold sections load in the background so the hero paints fast
const Services = lazy(() => import('./components/Services'))
const CaseStudies = lazy(() => import('./components/CaseStudies'))
const Reviews = lazy(() => import('./components/Reviews'))
const Process = lazy(() => import('./components/Process').then((m) => ({ default: m.Process })))
const Stats = lazy(() => import('./components/Process').then((m) => ({ default: m.Stats })))
import {
  ClientStrip, FAQ, Contact, Footer, faqs,
} from './components/Sections'

export default function App() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09 })
    window.__lenis = lenis
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      const target = a && a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -16 })
    }
    document.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener('click', onClick)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  // FAQ schema helps both classic search and answer engines quote us
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only z-[60] rounded-full bg-ink px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <ClientStrip />
        <ProductReveal />
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <Services />
          <CaseStudies />
          <Process />
          <Stats />
          <Reviews />
        </Suspense>
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </MotionConfig>
  )
}
