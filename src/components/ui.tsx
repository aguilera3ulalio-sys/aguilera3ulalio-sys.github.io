import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { chapters, profile } from '../data/content'
import images from '../data/images.json'

// The small shared building blocks every page uses: reveal-on-scroll wrapper,
// photos, the page header, the navigation and the footer.

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article' | 'figure'
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect() // I only want the entrance once, not every time.
        }
      },
      // The bottom margin makes things start appearing just before they scroll
      // into view, so nothing is still blank by the time I am looking at it.
      { threshold: 0, rootMargin: '0px 0px 20% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      // @ts-expect-error - the ref type depends on which tag I picked, and that is fine here
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

/**
 * Every photo on the site goes through this. Each photo exists as several WebP
 * files of different widths (made by scripts/build-images.py). I hand the
 * browser the whole list plus a hint of how wide the photo is shown, and it
 * downloads the smallest file that still looks sharp on that screen.
 */
export function Picture({ name, alt, sizes }: { name: string; alt: string; sizes: string }) {
  const info = (images as Record<string, { width: number; height: number; widths: number[] }>)[name]
  const url = (w: number) => `${import.meta.env.BASE_URL}images/${name}-${w}.webp`
  const largest = info.widths[info.widths.length - 1]
  return (
    <img
      src={url(largest)}
      srcSet={info.widths.map((w) => `${url(w)} ${w}w`).join(', ')}
      sizes={sizes}
      // Telling the browser the shape up front lets it reserve the space.
      width={info.width}
      height={info.height}
      alt={alt}
      // I load photos as soon as the page opens instead of waiting until they are
      // scrolled to. Each page only has a handful and the files are small now, so
      // by the time I scroll down they are already there and appear instantly.
      loading="eager"
      decoding="async"
    />
  )
}

/** A photo that wipes open when it enters the screen. Alt text is mandatory. */
export function Photo({
  src,
  alt,
  className = '',
  // By default a photo fills the phone screen and about half of a desktop one.
  sizes = '(max-width: 820px) 100vw, 50vw',
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
}) {
  return (
    <Reveal as="figure" className={`photo ${className}`}>
      <Picture name={src} alt={alt} sizes={sizes} />
    </Reveal>
  )
}

/** The big title block at the top of every inner page. */
export function PageHero({
  index,
  title,
  lead,
  children,
}: {
  index: string
  title: string
  lead: string
  children?: ReactNode
}) {
  // Each page sets its own browser tab title.
  useEffect(() => {
    document.title = `${title} - Eulalio Aguilera`
  }, [title])

  return (
    <header className="page-hero">
      <div className="page-hero__text">
        <p className="eyebrow">
          <span className="accent">{index}</span> / {title}
        </p>
        <h1 className="page-hero__title">
          <span className="rise">
            <span>{title}</span>
          </span>
        </h1>
        <p className="page-hero__lead">{lead}</p>
      </div>
      {children}
    </header>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu whenever I land on a new page.
  useEffect(() => setOpen(false), [pathname])

  // Stop the page behind the menu from scrolling while it is open.
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
  }, [open])

  return (
    <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Main">
      <Link to="/" className="nav__brand" aria-label="Eulalio Aguilera, home">
        <span className="nav__dot" aria-hidden="true" />
        Eulalio Aguilera
      </Link>

      <button
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <ul className="nav__links" id="nav-links">
        {chapters.map((c, i) => (
          <li key={c.to}>
            <NavLink to={c.to}>
              <span className="nav__num">0{i + 1}</span>
              {c.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <p className="eyebrow">Contact</p>
      <a className="footer__cta" href={`mailto:${profile.emails[0]}`}>
        Let&apos;s talk
      </a>

      <div className="footer__grid">
        <div>
          <h2 className="footer__label">Email</h2>
          <ul>
            {profile.emails.map((mail) => (
              <li key={mail}>
                <a href={`mailto:${mail}`}>{mail}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer__label">Elsewhere</h2>
          <ul>
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer__label">Pages</h2>
          <ul>
            {chapters.map((c) => (
              <li key={c.to}>
                <Link to={c.to}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="footer__fine">
        {profile.firstName} {profile.lastName} / {profile.location}
      </p>
    </footer>
  )
}

/** "Next page" strip at the bottom of each inner page, so the site reads like a story. */
export function NextChapter({ current }: { current: string }) {
  const i = chapters.findIndex((c) => c.to === current)
  const next = chapters[(i + 1) % chapters.length]
  return (
    <Link to={next.to} className="next">
      <span className="eyebrow">Next</span>
      <span className="next__title">{next.title}</span>
    </Link>
  )
}
