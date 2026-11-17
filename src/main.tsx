import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import '@fontsource/anton'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'
import { Footer, Nav } from './components/ui'
import Home from './pages/Home'
import { Basketball, Career, Education, Projects } from './pages/Inner'

// One Lenis instance for the whole site smooths the scrolling. I keep it quick
// (high lerp, a bit more distance per wheel tick) so it never feels sluggish,
// and I skip it when the visitor has asked their system for reduced motion.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const lenis = prefersReducedMotion ? null : new Lenis({ autoRaf: true, lerp: 0.22, wheelMultiplier: 1.3 })

function Layout() {
  const { pathname } = useLocation()

  // Every page change starts from the top, instantly, like a real page load.
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      {/* The key makes the page fade in again on every route change. */}
      <main id="main" key={pathname} className="page">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="education" element={<Education />} />
          <Route path="career" element={<Career />} />
          <Route path="projects" element={<Projects />} />
          <Route path="basketball" element={<Basketball />} />
          {/* Anything unknown just goes home. */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
