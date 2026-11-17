import { lazy, Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui'
import { chapters, marquee, profile, stats } from '../data/content'

// three.js is the heaviest thing on the site, so I load it after the text is
// already on screen instead of making the visitor wait for it.
const BallScene = lazy(() => import('../components/BallScene'))

export default function Home() {
  useEffect(() => {
    document.title = 'Eulalio Aguilera - Software Engineer'
  }, [])

  return (
    <>
      {/* Fixed 3D backdrop. It lives behind everything and reacts to scroll. */}
      <Suspense fallback={null}>
        <BallScene mode="home" />
      </Suspense>

      <section className="hero">
        <p className="hero__meta eyebrow">
          <span className="accent">{profile.role}</span> / {profile.location}
        </p>

        {/* My name, as big as the screen allows. The second line is only an
            outline so the ball shows through the letters. */}
        <h1 className="hero__name">
          <span className="rise">
            <span>{profile.firstName}</span>
          </span>
          <span className="rise rise--late hero__name-outline">
            <span>{profile.lastName}</span>
          </span>
        </h1>

        <div className="hero__foot">
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__scroll eyebrow" aria-hidden="true">
            Scroll
          </p>
        </div>
      </section>

      {/* Statement + quick facts. Kept to the left so the ball can park on the right. */}
      <section className="intro">
        <Reveal>
          <p className="eyebrow">
            <span className="accent">00</span> / About
          </p>
          <p className="intro__statement">{profile.statement}</p>
        </Reveal>

        <ul className="stats">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 90}>
              <span className="stats__value">{s.value}</span>
              <span className="stats__label">{s.label}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* A strip of the things I work with, sliding sideways forever. */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...marquee, ...marquee].map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </div>
      </div>

      {/* The four chapters. Each row is one big link to its page. */}
      <section className="chapters">
        <p className="eyebrow">Explore</p>
        <ul>
          {chapters.map((c, i) => (
            <Reveal as="li" key={c.to}>
              <Link to={c.to} className="chapter">
                <span className="chapter__num">0{i + 1}</span>
                <span className="chapter__body">
                  <span className="chapter__title">{c.title}</span>
                  <span className="chapter__line">{c.line}</span>
                </span>
                <span className="chapter__img">
                  <img src={c.image} alt={c.alt} loading="lazy" decoding="async" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  )
}
