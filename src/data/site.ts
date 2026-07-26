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
  /** Carried over from the old site's title and meta description. */
  role: 'Game Developer',
  /** @verify — city shown in the footer. Set to null to hide it. */
  location: 'United States',
  url: 'https://jordanthrash.netlify.app',

  description:
    'Game developer building in Unity and C# — VR, procedural generation, physics simulation and the tools that make them faster to build.',
} as const;

/**
 * The hero headline renders one line per array entry so each can animate
 * independently. Three short lines works best; longer lines wrap badly.
 */
export const hero = {
  eyebrow: 'Game Developer',
  headline: ['I design systems', 'you can play.'],
  lede: 'Unity and C# developer working across VR, procedural generation and physics simulation. Thirteen shipped games and tools — each one an excuse to build a system I had not built before.',
  stats: [
    { value: '13', label: 'Games & tools shipped' },
    { value: '6', label: 'Years in Unity' },
    { value: 'VR', label: 'Oculus Quest native' },
  ],
} as const;

/**
 * @verify — replace with the copy from your old `about-me.html`. What is here
 * is written from the skills and projects on the old site, not from your words.
 */
export const about = {
  paragraphs: [
    'I build games because they are the only software where the systems are the point. A physics solver, a procedural generator, a netcode layer — in most products those are plumbing. In a game they are the thing the player actually touches.',
    'Most of my work is Unity and C#, spanning VR on Oculus Quest, procedural level generation, physics simulation and real-time multiplayer. I have shipped thirteen projects, and the common thread is that each one existed to force me through a system I had not written before.',
    'I also build the tooling around the games — editor extensions, debugging utilities, anything that shortens the loop between an idea and seeing it run. The faster that loop, the better the game gets.',
  ],
  /** Grouped so the section reads as capability areas, not a keyword dump. */
  stack: [
    {
      area: 'Engine & language',
      items: ['Unity 3D', 'C#', 'Unity Editor tooling', 'ScriptableObjects', 'URP'],
    },
    {
      area: 'Systems',
      items: [
        'Procedural generation',
        'Physics simulation',
        'Gameplay mechanics',
        'AI & pathfinding',
        'Multiplayer netcode',
      ],
    },
    {
      area: 'VR',
      items: ['Oculus Quest', 'XR Interaction Toolkit', 'Room-scale design', 'Performance budgets'],
    },
    {
      area: 'Craft',
      items: ['Git & version control', 'Photoshop', 'UI / TextMesh Pro', 'Playtesting', 'Shipping'],
    },
  ],
} as const;

/**
 * @verify — every date and title. This is the section a recruiter reads most
 * closely. `end: null` renders as "Present". Set to `[]` to hide the section.
 */
export const experience = [
  {
    role: 'Backend Software Engineer',
    company: 'Virta Health',
    start: '2022',
    end: null,
    summary:
      'Backend services and data models for a virtual care platform. The day job that funds the game development.',
    tags: ['Python', 'PostgreSQL', 'APIs'],
  },
  {
    role: 'Game Developer',
    company: 'Thrash Gamedev',
    start: '2019',
    end: null,
    summary:
      'Designing, building and shipping Unity games and developer tools — from VR experiences to procedural simulations.',
    tags: ['Unity', 'C#', 'VR', 'Game design'],
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
  /** Headline for the contact band. */
  pitch: 'Open to game development work, collaborations and interesting problems.',
  links: [
    {
      label: 'GitHub',
      handle: 'Thrash-Gamedev',
      href: 'https://github.com/orgs/Thrash-Gamedev/repositories',
    },
    { label: 'itch.io', handle: 'jthrash52', href: 'https://jthrash52.itch.io/' },
    {
      label: 'LinkedIn',
      handle: 'jordan-thrash',
      href: 'https://www.linkedin.com/in/jordan-thrash-4a31a6177/',
    },
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
