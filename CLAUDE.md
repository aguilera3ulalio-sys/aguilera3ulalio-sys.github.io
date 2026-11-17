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
- three.js through React Three Fiber and drei
- GSAP (ScrollTrigger) for scroll animation, Lenis for smooth scrolling
- React Router for the pages
- Plain CSS with custom properties for the design tokens (no UI kit)
- Hosting: to be decided (Vercel or Cloudflare Pages), domain eulalio.com

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

The real CV content has not been written down yet. Do not invent facts (schools, employers,
dates, stats, awards). Use clearly marked placeholders until I provide:

- [ ] Short bio / tagline
- [ ] Education entries
- [ ] Career entries
- [ ] Projects list (existing GitHub repos are candidates)
- [ ] Basketball achievements and tournaments
- [ ] Contact links (email to publish, LinkedIn, GitHub, Instagram)
- [ ] CV PDF
- [ ] Languages for the site (English only, or English + Spanish)

## Conventions

- No emojis anywhere, in code or copy.
- Comment the code generously, written in first person as my own notes.
- Accessibility: semantic HTML, keyboard navigation, alt text on every photo.
- Mobile first; the site has to look as good on a phone as on a desktop.

## Repository

- GitHub: `aguilera3ulalio-sys/eulalio.com` (private while it is under construction).
- The project folder sits in iCloud Drive. `node_modules` and build output are git-ignored;
  if iCloud sync causes trouble with them, move the working copy outside iCloud.
