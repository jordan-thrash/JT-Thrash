/**
 * Personal copy, links, and biography. Project stories live separately in
 * `src/content/projects/*.md`.
 */

export const site = {
  name: 'Jordan Thrash',
  role: 'Game Developer & Backend Engineer',
  location: 'United States',
  url: 'https://jordanthrash.netlify.app',

  description:
    'Jordan Thrash — game developer and backend engineer. Unity games, gameplay experiments, and professional work with Python, Go, AWS, and PostgreSQL.',
} as const;

/**
 * The hero headline renders one line per array entry so each can animate
 * independently. Two or three short lines works best — longer lines wrap badly
 * at the display size. `<em>` marks the accented word.
 */
export const hero = {
  headline: ['Game developer.', '<em>Backend</em> engineer.'],
  lede: 'Games brought me to programming. Today I build backend services professionally and make games in Unity in my own time. This is a collection of the games, experiments, and tools I’ve made along the way.',
} as const;

export const whyGames = {
  heading: 'Why I keep making games',
  paragraphs: [
    'I started programming in high school. An HTML and CSS class in sophomore year showed me that I could make something of my own with code. That possibility stayed with me. I built a gaming PC soon after and started learning computer graphics and making games in Unity.',
    'By senior year, I had published two games. They were unoptimized and unpolished, and I was proud of them. Ideas I had worked through at my desk had become something another person could play. Making that happen meant a lot to me.',
    'I kept making games through college, where I studied computer science and engineering with a specialization in game design and computer graphics. I chose a career in software engineering for the stability and room it gave me for life outside work. I never lost my attachment to making games.',
    'I still work on games in my free time. Much of that work never gets published, but I care about the process just as much: trying an idea, seeing how it feels to play, and changing it until it starts to feel like the game I had in mind.',
  ],
  pullQuote: 'They were unoptimized and unpolished, and I was proud of them.',
} as const;

export const about = {
  heading: 'My work in backend engineering',
  paragraphs: [
    'My professional work spans batch processing, APIs, and the services and data behind them. At Capital One, I worked on rewards processing in Python and Java, and on Go APIs using AWS Lambda and DynamoDB.',
    'I now work in backend engineering at Virta Health, with Kubernetes, PostgreSQL, and microservices. My day-to-day work involves the services behind a healthcare product, from the data they store to the infrastructure they run on.',
  ],
  stack: [
    {
      area: 'Backend languages',
      items: ['Python', 'Go', 'Java'],
    },
    {
      area: 'Services & data',
      items: ['REST & GraphQL APIs', 'PostgreSQL', 'DynamoDB', 'Batch processing'],
    },
    {
      area: 'Cloud & infrastructure',
      items: ['AWS Lambda', 'SQS / SNS', 'S3', 'Kubernetes'],
    },
    {
      area: 'Games & real-time',
      items: [
        'Unity',
        'C#',
        'Gameplay systems',
        'Procedural generation',
        'Physics simulation',
        'VR / Oculus Quest',
      ],
    },
  ],
} as const;

/**
 * Period labels allow a previous role to omit a start date when it has not
 * been supplied. Do not infer employment dates from graduation dates.
 */
export const experience = [
  {
    role: 'Backend Software Engineer',
    company: 'Virta Health',
    start: 'Nov 2025',
    end: null,
    period: 'Nov 2025–Present',
    summary:
      'Backend engineering with microservices, PostgreSQL, and Kubernetes.',
    tags: ['PostgreSQL', 'Kubernetes', 'Microservices'],
  },
  {
    role: 'Software Engineer, Associate → Senior Associate',
    company: 'Capital One',
    start: null,
    end: '2025',
    period: 'Through 2025',
    summary:
      'Rewards batch processing in Python and Java, and API development in Go using AWS Lambda and DynamoDB. Promoted to Senior Associate in May 2024.',
    tags: ['Python', 'Go', 'Java', 'AWS'],
  },
] as const;

export const education = [
  {
    school: 'The Ohio State University',
    credential: 'B.S. Computer Science & Engineering',
    detail: 'December 2021 · Specialization in Game Design & Computer Graphics',
  },
] as const;

export const contact = {
  email: 'jordanthrash52@gmail.com',
  /** Headline for the contact section. */
  pitch: 'Want to talk about a game, a backend problem, or a project of your own? Send me a note.',
  links: [
    {
      label: 'GitHub',
      handle: 'jordan-thrash',
      href: 'https://github.com/jordan-thrash',
    },
    {
      label: 'LinkedIn',
      handle: 'jordan-thrash',
      href: 'https://www.linkedin.com/in/jordan-thrash-4a31a6177/',
    },
    { label: 'itch.io', handle: 'jthrash52', href: 'https://jthrash52.itch.io/' },
  ],
} as const;

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'Why games', href: '/#why-games' },
  { label: 'Backend', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
] as const;

export type Experience = (typeof experience)[number];
export type ContactLink = (typeof contact.links)[number];
