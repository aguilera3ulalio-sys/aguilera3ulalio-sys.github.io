# Eulalio.com

Personal website for Eulalio Aguilera. It works as an interactive CV: the link goes on the
printed/PDF CV, and recruiters land here to see the full story.

## Goal

- A very attractive, memorable personal site, not a template-looking portfolio.
- Inspiration: the Lando Norris personal site. Take the *feel* (bold oversized typography,
  full-screen sections, smooth scroll-driven motion, a 3D hero, strong personal branding),
  not its assets, colors, layout or copy. The identity here has to be my own.
- It must still do the CV job: someone with 30 seconds should find education, experience
  and contact without fighting the animations.

## Pages

| Route         | Content                                                                    |
|---------------|----------------------------------------------------------------------------|
| `/`           | Hero with the three.js scene, short intro, teasers linking to every page   |
| `/education`  | Schools, degrees, dates, highlights, photos                                |
| `/career`     | Career path as a timeline: roles, companies, dates, what I did             |
| `/projects`   | Project cards with description, stack, links (GitHub repos, live demos)    |
| `/basketball` | Free-time side: achievements, tournaments, teams, photo gallery            |

Shared on every page: navigation, contact/social links, a "Download CV" button (PDF).

## Stack

- Vite + React + TypeScript
- three.js through React Three Fiber (the basketball is drawn in a shader, no model files)
- Lenis for smooth scrolling; entrances are CSS transitions triggered by IntersectionObserver
- React Router for the pages (the host needs an SPA fallback to `index.html`)
- Plain CSS with custom properties for the design tokens (no UI kit)
- Fonts: Anton (display) and Space Grotesk (body), self-hosted through fontsource
- Hosting: to be decided (Vercel or Cloudflare Pages), domain eulalio.com

## Commands

- `npm run dev` - local dev server
- `npm run build` - type-check and build into `dist/`
- `npm run preview` - serve the built site

## Code map

- `src/data/content.ts` - every word and fact on the site; edit content here only
- `src/components/BallScene.tsx` - the 3D basketball (home backdrop and basketball page)
- `src/components/ui.tsx` - nav, footer, page header, reveal and photo helpers
- `src/pages/Home.tsx`, `src/pages/Inner.tsx` - the home page and the four inner pages
- `src/styles.css` - all styling; colours and fonts are tokens at the top

## Design identity

Near-black background, warm bone-white text, basketball orange (`#ff5a1f`) as the only
accent. Oversized uppercase Anton headings, small spaced-out labels, hairline dividers.

## 3D guidelines

- One signature scene in the hero, plus lighter 3D accents on inner pages
  (the basketball page is the natural place for a 3D ball).
- Keep it fast: lazy-load the canvas, cap the device pixel ratio, pause rendering when
  the canvas is off screen.
- Respect `prefers-reduced-motion` and give low-power / mobile devices a static fallback.
- The content must be readable with the 3D switched off.

## Photos

Source photos live in `Photos/`, organised by section. These are originals; do not edit or
delete them.

- `Photos/Education/`
- `Photos/Carrer/` (career)
- `Photos/Baketball/` (basketball)

Folder names are spelled as they were created. The site should not load from here directly:
optimised copies (WebP/AVIF, resized) go in `public/images/<section>/`. The HEIC files have
to be converted, browsers cannot display them.

## Content status

Content comes from my CV and what I have told you. Do not invent facts (schools, employers,
dates, stats, awards); ask me instead.

- [x] Bio, education, career, basketball honours, contact links (site is English only)
- [ ] More projects: front-end and automation work still to be added
- [ ] Dates for the Hospital Moscati social service
- [ ] "Download CV" button: the current CV PDF includes my phone number, decide before publishing it
- [ ] Hosting and domain setup

## Conventions

- No emojis anywhere, in code or copy.
- Comment the code generously, written in first person as my own notes.
- Accessibility: semantic HTML, keyboard navigation, alt text on every photo.
- Mobile first; the site has to look as good on a phone as on a desktop.

## Repository

- GitHub: `aguilera3ulalio-sys/eulalio.com` (private while it is under construction).
- The project folder sits in iCloud Drive. `node_modules` and build output are git-ignored;
  if iCloud sync causes trouble with them, move the working copy outside iCloud.
