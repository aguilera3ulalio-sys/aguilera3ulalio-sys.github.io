import { lazy, Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui'
import { career, chapters, marquee, profile, projects, skills, stats } from '../data/content'

// three.js is the heaviest thing on the site, so I load it after the text is
// already on screen instead of making the visitor wait for it.
const HeroScene = lazy(() => import('../components/HeroScene'))

/** Renders a list of strings the way it would look in source code. */
function CodeList({ items }: { items: string[] }) {
  return (
    <>
      [
      {items.map((it, i) => (
        <span key={it}>
          <span className="tok-str">'{it}'</span>
          {i < items.length - 1 ? ', ' : ''}
        </span>
      ))}
      ]
    </>
  )
}

/**
 * My profile written as a code file. It is built from the same data as the
 * rest of the site, so it can never drift out of date.
 */
function CodeCard() {
  const current = career[0]
  const languages = skills[0].items
  const tools = ['React', 'FastAPI', 'Node.js', 'Power Platform', 'AWS']

  return (
    <Reveal className="code">
      <div className="code__bar">
        <span className="code__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="code__file">eulalio.ts</span>
      </div>
      <pre className="code__body">
        <code>
          <span className="tok-key">const</span> <span className="tok-name">eulalio</span> = {'{'}
          {'\n  '}role: <span className="tok-str">'{profile.role}'</span>,
          {'\n  '}now: <span className="tok-str">'{current.role} at {current.company}'</span>,
          {'\n  '}based: <span className="tok-str">'{profile.location}'</span>,
          {'\n  '}languages: <CodeList items={languages} />,
          {'\n  '}tools: <CodeList items={tools} />,
          {'\n  '}focus: <CodeList items={['automation', 'AI data pipelines', 'full-stack']} />,
          {'\n  '}openToWork: <span className="tok-key">true</span>,
          {'\n'}
          {'}'}
          <span className="code__cursor" aria-hidden="true" />
        </code>
      </pre>
    </Reveal>
  )
}

export default function Home() {
  useEffect(() => {
    document.title = 'Eulalio Aguilera - Software Engineer'
  }, [])

  // The first three projects are the ones I want people to see straight away.
  const featured = projects.slice(0, 3)

  return (
    <>
      {/* Fixed 3D backdrop: a network of nodes passing data around. */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      <section className="hero">
        {/* A terminal-style line that says what I am before my name does. */}
        <p className="hero__meta eyebrow">
          <span className="accent">&gt;</span> {profile.role} / {profile.location}
          <span className="hero__caret" aria-hidden="true" />
        </p>

        {/* My name, as big as the screen allows. The second line is only an
            outline so the network shows through the letters. */}
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

      {/* Statement + quick facts. Kept to the left so the network can park on the right. */}
      <section className="intro">
        <Reveal>
          <p className="eyebrow">
            <span className="accent">00</span> / About
          </p>
          <p className="intro__statement">{profile.statement}</p>
        </Reveal>

        <ul className="stats">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 70}>
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

      {/* The engineering part up front: my profile as code, next to what I have built. */}
      <section className="work" id="work">
        <div className="work__left">
          <p className="eyebrow">
            <span className="accent">//</span> Profile
          </p>
          <CodeCard />
        </div>

        <div className="work__right">
          <p className="eyebrow">
            <span className="accent">//</span> Selected work
          </p>
          <ul className="work__list">
            {featured.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 70}>
                <Link to="/projects" className="work__item">
                  <span className="work__status">{p.status}</span>
                  <span className="work__name">{p.name}</span>
                  <span className="work__stack">{p.stack.join(' / ')}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <Link to="/projects" className="project__link">
            All projects
          </Link>
        </div>
      </section>

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
