// All the words and facts on the site live in this one file.
// When my CV changes I only want to touch this file, never the page components.

export const profile = {
  firstName: 'Eulalio',
  lastName: 'Aguilera',
  role: 'Software Engineer',
  location: 'Querétaro, Mexico',
  tagline: 'Software engineer building automation tools and AI-powered products.',
  // The longer statement I show right under the hero on the home page.
  statement:
    'I build software that removes busywork: internal tools, automation flows, AI data pipelines and full-stack apps that real teams use every day.',
  emails: ['aguilera3ulalio@icloud.com', 'aguilera3ulalio@gmail.com'],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/eulalio-aguilera-286113332' },
    { label: 'GitHub', href: 'https://github.com/aguilera3ulalio-sys' },
    { label: 'Instagram', href: 'https://www.instagram.com/eulalio_aarr' },
  ],
}

// The three quick facts on the home page. I keep these to things I can back up.
export const stats = [
  { value: '2', label: 'Industry roles: Inteva Products and Storecheck' },
  { value: '9.02', label: 'Grade average out of 10 at UAQ' },
  { value: '2026', label: 'B.S. in Software Engineering, graduating' },
]

// The four chapters of the site, software first. The home page, the nav and the
// "next" links all read their order from here.
export const chapters = [
  {
    to: '/projects',
    title: 'Projects',
    line: 'AI products, full-stack apps and automation.',
    image: '/images/career/at-work-sm.jpg',
    alt: 'Working on a laptop at a wooden desk',
  },
  {
    to: '/career',
    title: 'Career path',
    line: 'Inteva Products, Storecheck and Hospital Moscati.',
    image: '/images/career/inteva-sm.jpg',
    alt: 'Standing next to the Inteva Querétaro Technical Center sign',
  },
  {
    to: '/education',
    title: 'Education',
    line: 'Software Engineering at Universidad Autónoma de Querétaro.',
    image: '/images/education/campus-sm.jpg',
    alt: 'University campus buildings under a cloudy sky',
  },
  {
    to: '/basketball',
    title: 'Off the clock',
    line: 'Basketball: national titles and state teams.',
    image: '/images/basketball/champions-banner-sm.jpg',
    alt: 'Team photo behind a champions banner after a tournament win',
  },
]

// The words that scroll across the marquee strip on the home page.
export const marquee = [
  'Python',
  'React',
  'FastAPI',
  'Power Platform',
  'AWS',
  'SQL',
  'Automation',
  'AI data pipelines',
  'Node.js',
  'three.js',
]

export const education = [
  {
    school: 'Universidad Autónoma de Querétaro',
    short: 'UAQ',
    period: '2023 - 2026',
    degree: 'B.S. in Software Engineering',
    detail: 'School of Computer Science',
    points: [
      '9.02 out of 10 overall grade average.',
      'Finishing my degree and close to graduating.',
    ],
    photos: [{ src: '/images/education/campus.jpg', alt: 'University campus buildings under a cloudy sky' }],
  },
  {
    school: 'Prepa Anáhuac Querétaro',
    short: 'High school',
    period: 'Graduated 2023',
    degree: 'High school diploma',
    detail: 'Basketball scholarship student',
    points: [
      'Earned my IELTS certification at B2 level.',
      'Competed in robotics competitions.',
      'Played on the school basketball team on a sports scholarship.',
    ],
    photos: [
      { src: '/images/education/graduation.jpg', alt: 'Graduation day in caps and gowns with classmates' },
      { src: '/images/education/robotics.jpg', alt: 'Adjusting a robot at a robotics competition, wearing a team captain cap' },
    ],
  },
]

export const certifications = [
  'AWS Academy Cloud Foundations',
  'IELTS Advanced B2',
  'Microsoft PowerPoint',
  'Adobe Photoshop',
]

export const courses = [
  'AI, Empathy and Ethics (UC)',
  'Intro to Generative AI (Google Cloud)',
  'Business Implications of AI (EIT Digital)',
  'Economics of AI (UVA)',
  'Build AI Apps with ChatGPT, DALL-E and GPT-4',
]

export const educationGallery = [
  { src: '/images/education/school-days.jpg', alt: 'In school uniform with family at a school event' },
  { src: '/images/education/friends.jpg', alt: 'With friends on a night out' },
  { src: '/images/education/competition-hall.jpg', alt: 'With a friend inside a large covered hall during an event' },
]

export const career = [
  {
    company: 'Inteva Products',
    role: 'Software Engineer Intern',
    period: 'Aug 2026 - Present',
    place: 'Querétaro, Mexico',
    points: [
      'I develop internal tools and software that automate and streamline workflows across the company, cutting manual processes.',
      'I build with the Microsoft Power Platform: Power Automate for workflows, Power Apps for internal applications and Power BI for reporting.',
    ],
    photos: [{ src: '/images/career/inteva.jpg', alt: 'Standing next to the Inteva Querétaro Technical Center sign' }],
  },
  {
    company: 'Storecheck',
    role: 'AI Data Collaborator - professional internship',
    period: '2026',
    place: 'Querétaro, Mexico',
    points: [
      'Worked inside the AI development pipeline: tagging, validating and preparing datasets for model training and fine-tuning.',
      'Handled database movements for the training data and kept it clean.',
      'Found edge cases, corrected annotation errors and documented quality guidelines.',
    ],
    photos: [
      { src: '/images/career/storecheck.jpg', alt: 'In front of the Storecheck sign at the office reception' },
      { src: '/images/career/at-work.jpg', alt: 'Working on a laptop at a wooden desk in the office' },
    ],
  },
  {
    company: 'Hospital Moscati',
    role: 'Social service',
    period: 'University social service',
    place: 'Querétaro, Mexico',
    points: [
      'Supported the emergency department as a helper.',
      'Worked in client service, attending to patients and visitors.',
    ],
    photos: [{ src: '/images/career/service.jpg', alt: 'Portrait in a navy uniform polo shirt' }],
  },
]

export const skills = [
  { group: 'Languages', items: ['Python', 'JavaScript', 'SQL', 'C', 'C++'] },
  { group: 'Backend and APIs', items: ['FastAPI', 'Node.js', 'Express', 'REST APIs', 'JWT', 'AWS Lambda', 'API Gateway'] },
  { group: 'Frontend', items: ['React', 'HTML', 'CSS', 'Tailwind CSS'] },
  { group: 'Power Platform', items: ['Power BI', 'Power Automate', 'Power Apps'] },
  { group: 'Databases', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Firebase Firestore'] },
  { group: 'Cloud and DevOps', items: ['AWS', 'Vercel', 'GitHub Actions', 'Docker'] },
]

export const projects = [
  {
    name: 'AI Architecture Inspiration',
    status: 'In development',
    summary:
      'An AI home architect. Describe your dream home and get floor plans, a 3D construction, cost estimates and preliminary drawings.',
    stack: ['AI', '3D', 'Full-stack'],
    href: 'https://github.com/aguilera3ulalio-sys/architect-inspire',
  },
  {
    name: 'Sign Language to Text Translator',
    status: 'Hardware + software',
    summary:
      'A custom gesture classifier trained on data I collected by hand, running real-time inference on an Arduino. The full ML pipeline from data collection to embedded hardware.',
    stack: ['Python', 'OpenCV', 'scikit-learn', 'Arduino'],
    href: null,
  },
]

// Basketball honours, in the order I want them to hit.
export const honours = [
  { name: 'CONADEIP', note: 'Champion' },
  { name: 'ADEMEBA', note: 'National tournaments, champion' },
  { name: 'Torneo de la Amistad', note: 'Multiple titles' },
  { name: 'Liga Premier Querétaro', note: 'Champion' },
  { name: 'Liga Elite', note: 'Champion' },
  { name: 'Liga LIDEIP', note: 'Champion' },
  { name: 'State teams', note: 'Selected from elementary through high school' },
  { name: 'Colombia', note: 'Took the game abroad' },
]

export const basketballGallery = [
  { src: '/images/basketball/champions-banner.jpg', alt: 'Team photo behind a champions banner after winning the tournament', wide: true },
  { src: '/images/basketball/cup-with-coach.jpg', alt: 'Holding up a peace sign next to my coach, who is carrying the champions cup' },
  { src: '/images/basketball/state-team.jpg', alt: 'Selfie with the whole state team in black Querétaro jerseys', wide: true },
  { src: '/images/basketball/two-trophies.jpg', alt: 'As a kid, holding a trophy next to my coach' },
  { src: '/images/basketball/first-court.jpg', alt: 'As a kid on an outdoor court with my coach, holding a trophy' },
  { src: '/images/basketball/early-trophy.jpg', alt: 'Four young teammates in blue bibs sharing a trophy' },
]
