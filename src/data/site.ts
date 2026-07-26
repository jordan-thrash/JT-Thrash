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
  /** Shown beside the name in the header and used in structured data. */
  role: 'Software Engineer',
  /** @verify — city shown in the footer. Set to null to hide it. */
  location: 'United States',
  url: 'https://jordanthrash.netlify.app',

  description:
    'Software engineer and app developer. Backends, applications, platforms and games — built end to end.',
} as const;

/**
 * The hero headline renders one line per array entry so each can animate
 * independently. Two or three short lines works best — longer lines wrap badly
 * at the display size. `<em>` marks the accented word.
 */
export const hero = {
  headline: ['I build the', '<em>whole</em> system.'],
  /** Running metadata in the masthead rule. Keep it terse and factual. */
  spec: 'Backend · Applications · Platforms · Games',
  lede: 'Software engineer and app developer. I build backends, applications and the infrastructure underneath them — and I got here through game development, which is still where much of the index below comes from.',
} as const;

/**
 * @verify — this is written from your public work, not from your own words.
 * Worth replacing with your voice before launch.
 */
export const about = {
  paragraphs: [
    'I build software end to end — the services, the data models, the interface on top and the infrastructure holding it up. What I care about is whether a system stays correct and stays fast once real usage arrives, which is usually decided long before anyone sees a screen.',
    'Professionally that means backend engineering: APIs, data models, and the unglamorous parts that decide whether a product feels solid or feels broken. Alongside that I design and ship applications on my own, where I own the whole stack rather than a slice of it — which is the part that keeps me honest about what shipping actually costs.',
    'I started in game development, and it is still the fastest way I know to learn a system properly. A game leaves nowhere to hide: the physics either resolves, the netcode either stays in sync, the generator either produces something worth playing. Most of the index below came out of that, and the habits transfer directly to everything else I build.',
  ],
  /**
   * @verify — grouped so the section reads as capability areas rather than a
   * keyword dump. Trim anything you would not want to be interviewed on.
   */
  stack: [
    {
      area: 'Backend',
      items: ['Python', 'TypeScript / Node', 'PostgreSQL', 'REST & GraphQL APIs', 'Data pipelines'],
    },
    {
      area: 'Applications',
      items: ['React', 'Astro', 'TypeScript', 'Responsive UI', 'Accessibility'],
    },
    {
      area: 'Platform',
      items: ['Docker', 'CI / CD', 'Cloud deployment', 'Observability', 'Performance'],
    },
    {
      area: 'Games',
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
    role: 'Independent Software Engineer',
    company: 'Client & product work',
    start: '2021',
    end: null,
    summary:
      'Applications, sites and backends built end to end for small businesses and my own products.',
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
  pitch: 'Open to engineering work, product builds and interesting systems problems.',
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
