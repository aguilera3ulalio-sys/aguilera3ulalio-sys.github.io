import { lazy, Suspense } from 'react'
import { NextChapter, PageHero, Photo, Reveal } from '../components/ui'
import {
  basketballGallery,
  career,
  certifications,
  courses,
  education,
  educationGallery,
  honours,
  projects,
  skills,
} from '../data/content'

// The four inner pages. They share the same skeleton (big header, numbered
// entries, photos, link to the next chapter), so I keep them together.

const BallScene = lazy(() => import('../components/BallScene'))

/** One block on a timeline: big heading on the left, details and photos on the right. */
function Entry({
  kicker,
  title,
  subtitle,
  detail,
  points,
  photos,
}: {
  kicker: string
  title: string
  subtitle: string
  detail?: string
  points: string[]
  photos: { src: string; alt: string }[]
}) {
  return (
    <article className="entry">
      <Reveal className="entry__head">
        <p className="eyebrow accent">{kicker}</p>
        <h2 className="entry__title">{title}</h2>
        <p className="entry__subtitle">{subtitle}</p>
        {detail && <p className="entry__detail">{detail}</p>}
      </Reveal>
      <div className="entry__body">
        <Reveal>
          <ul className="points">
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Reveal>
        <div className={`entry__photos entry__photos--${photos.length}`}>
          {photos.map((ph) => (
            <Photo key={ph.src} {...ph} />
          ))}
        </div>
      </div>
    </article>
  )
}

/** A titled list of small pills, used for skills, certifications and courses. */
function TagGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal className="tag-group">
      <h3 className="footer__label">{title}</h3>
      <ul className="tags">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </Reveal>
  )
}

export function Education() {
  return (
    <>
      <PageHero
        index="03"
        title="Education"
        lead="A software engineering degree with a 9.02 average, built on robotics competitions and an IELTS certification in high school."
      />

      {education.map((e) => (
        <Entry
          key={e.school}
          kicker={e.period}
          title={e.school}
          subtitle={e.degree}
          detail={e.detail}
          points={e.points}
          photos={e.photos}
        />
      ))}

      <section className="band">
        <h2 className="band__title">Certifications and courses</h2>
        <div className="band__grid">
          <TagGroup title="Certifications" items={certifications} />
          <TagGroup title="Courses" items={courses} />
          <TagGroup title="Languages" items={['Spanish - native', 'English - B2 (IELTS)']} />
        </div>
      </section>

      <section className="gallery gallery--three">
        {educationGallery.map((ph) => (
          <Photo key={ph.src} {...ph} />
        ))}
      </section>

      <NextChapter current="/education" />
    </>
  )
}

export function Career() {
  return (
    <>
      <PageHero
        index="02"
        title="Career path"
        lead="From AI training data at Storecheck to building internal software as an engineering intern at Inteva Products."
      />

      {career.map((c) => (
        <Entry
          key={c.company}
          kicker={c.period}
          title={c.company}
          subtitle={c.role}
          detail={c.place}
          points={c.points}
          photos={c.photos}
        />
      ))}

      <section className="band">
        <h2 className="band__title">Toolbox</h2>
        <div className="band__grid">
          {skills.map((s) => (
            <TagGroup key={s.group} title={s.group} items={s.items} />
          ))}
        </div>
      </section>

      <NextChapter current="/career" />
    </>
  )
}

export function Projects() {
  return (
    <>
      <PageHero
        index="01"
        title="Projects"
        lead="AI products, full-stack apps and automation. More front-end and automation work is on its way here."
      />

      <section className="projects">
        {projects.map((p, i) => (
          <Reveal as="article" key={p.name} className="project" delay={(i % 2) * 90}>
            <div className="project__top">
              <span className="project__num">0{i + 1}</span>
              <span className="project__status">{p.status}</span>
            </div>
            <h2 className="project__name">{p.name}</h2>
            <p className="project__summary">{p.summary}</p>
            <ul className="tags">
              {p.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {p.href && (
              <a className="project__link" href={p.href} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            )}
          </Reveal>
        ))}
      </section>

      <NextChapter current="/projects" />
    </>
  )
}

export function Basketball() {
  return (
    <>
      <PageHero
        index="04"
        title="Basketball"
        lead="What I do when I am not at a keyboard. I played on a basketball scholarship from elementary school all the way through high school."
      >
        {/* The same ball as the home page, here as a normal block next to the title. */}
        <div className="page-hero__ball">
          <Suspense fallback={null}>
            <BallScene />
          </Suspense>
        </div>
      </PageHero>

      <section className="honours">
        <p className="eyebrow">Honours</p>
        <ul>
          {honours.map((h, i) => (
            <Reveal as="li" key={h.name} className="honour">
              <span className="honour__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="honour__name">{h.name}</span>
              <span className="honour__note">{h.note}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="gallery gallery--court">
        {basketballGallery.map((ph) => (
          <Photo key={ph.src} src={ph.src} alt={ph.alt} className={ph.wide ? 'photo--wide' : ''} />
        ))}
      </section>

      <NextChapter current="/basketball" />
    </>
  )
}
