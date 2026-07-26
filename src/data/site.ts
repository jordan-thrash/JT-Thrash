/**
 * Every piece of copy, link and biographical fact on the site lives here or in
 * `src/content/projects/*.md`. Editing this file is the only thing needed to
 * keep the site current — no component changes required.
 *
 * ⚠️  Fields marked `@verify` were carried over from the Weebly site or
 * reconstructed from public sources. Read through them once and correct
 * anything wrong or out of date before launch.
 */

export const site = {
  name: 'Jordan Thrash',
  /**
   * Shown beside the name in the header and used in structured data. Kept
   * deliberately broad — the work spans apps, services, platforms and games,
   * and a narrower title undersells it in both directions.
   */
  role: 'Software & App Developer',
  /** @verify — city shown in the footer. Set to null to hide it. */
  location: 'United States',
  url: 'https://jordanthrash.netlify.app',

  description:
    'I build apps, backends, platforms and games — end to end. Software and app developer.',
} as const;

/**
 * The hero headline renders one line per array entry so each can animate
 * independently. Two or three short lines works best — longer lines wrap badly
 * at the display size. `<em>` marks the accented word.
 */
export const hero = {
  headline: ['I build the', '<em>whole</em> system.'],
  /** Running metadata in the masthead rule. Keep it terse and factual. */
  spec: 'Apps · Backends · Platforms · Games',
  lede: 'Apps, backends, platforms, games. Some of it professionally, some of it because I wanted the thing to exist — and in every case I would rather own the whole system than one layer of it.',
} as const;

/**
 * @verify — this is written from your public work, not from your own words.
 * Worth replacing with your voice before launch.
 */
export const about = {
  paragraphs: [
    'I build things end to end. Whatever the project needs — the service, the data model, the interface, the infrastructure underneath — I would rather own the whole shape of it than one layer. That holds whether it is a production backend, an app someone uses every day, or a game I made because I wanted it to exist.',
    'The range is wide on purpose. Services and the data behind them, applications people actually use, the deployment and tooling around both, and games where every system has to hold up in real time. Different constraints, same job each time: work out what the thing has to guarantee, then make it do that when real usage arrives.',
    'Games are where a lot of this got sharp. They leave nowhere to hide — the physics resolves or it does not, the netcode stays in sync or it does not, the generator produces something worth playing or it does not. Most of the index below came out of that, and the same instincts carry straight into everything else I build.',
  ],
  /**
   * @verify — grouped so the section reads as capability areas rather than a
   * keyword dump. Trim anything you would not want to be interviewed on.
   */
  stack: [
    {
      area: 'Applications',
      items: ['TypeScript', 'React', 'Astro', 'Responsive UI', 'Accessibility'],
    },
    {
      area: 'Services & data',
      items: ['Python', 'Node', 'PostgreSQL', 'REST & GraphQL APIs', 'Data pipelines'],
    },
    {
      area: 'Platform & tooling',
      items: ['Docker', 'CI / CD', 'Cloud deployment', 'Observability', 'Performance'],
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
 * @verify — every date, title and company. This is the section a recruiter
 * reads most closely. `end: null` renders as "Present". Set to `[]` to hide it.
 */
export const experience = [
  {
    role: 'Backend Software Engineer',
    company: 'Virta Health',
    start: '2022',
    end: null,
    summary:
      'Backend services and data models for a virtual care platform — the APIs and infrastructure behind patient-facing products.',
    tags: ['Python', 'PostgreSQL', 'APIs'],
  },
  {
    role: 'Independent Developer',
    company: 'Client & product work',
    start: '2021',
    end: null,
    summary:
      'Apps, sites and the backends behind them, built end to end for small businesses and for my own products.',
    tags: ['TypeScript', 'React', 'Python', 'Netlify'],
  },
  {
    role: 'Game Developer',
    company: 'Thrash Gamedev',
    start: '2019',
    end: null,
    summary:
      'Designing and shipping Unity games and the developer tooling around them, from VR to procedural simulation.',
    tags: ['Unity', 'C#', 'Game design'],
  },
] as const;

/** @verify — set to `[]` to drop the block entirely. */
export const education = [
  {
    school: 'The Ohio State University',
    credential: 'Computer Science & Engineering',
    detail: 'Where Splittle and the first Unity projects were built.',
  },
] as const;

/**
 * @verify — especially the email address, which is the single most important
 * link on the site.
 */
export const contact = {
  email: 'thrashstores@gmail.com',
  /** Headline for the contact section. */
  pitch: 'Open to product work, contract builds, and anything with an interesting system in it.',
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
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Contact', href: '/#contact' },
] as const;

export type Experience = (typeof experience)[number];
export type ContactLink = (typeof contact.links)[number];
