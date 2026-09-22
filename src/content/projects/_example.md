---
# Copy this file to add a project. The filename becomes the URL:
#   src/content/projects/vend-ready.md  ->  /work/vend-ready
#
# It is `draft: true`, so it stays out of the build until you flip that to
# false. Delete this comment block once you have filled the entry in.

title: Project Name
# One or two sentences. Used for link previews and under the title on the
# detail page. Say what it is and who it's for, not how it was made.
summary: A one-line description of what this is.

# Sorts the index — highest first. Leave room between numbers so you can slot
# things in later without renumbering everything.
order: 120
# Optional. Use a year only when it comes from the project record.
# year: '2026'

# Game | App | Web | Backend | Platform | Tool
kind: App

# The index's "Discipline" column. Two or three words: "Developer tooling",
# "Inventory platform", "Tower defense".
discipline: Short category

# Optional: Shipped | Playable | Prototype | In progress | Shelved
# Leave it out and the site makes no claim either way. Anything other than
# Shipped is printed next to the title in the index, so a half-finished thing
# can sit in the list honestly instead of being hidden or oversold.
# status: Prototype

# The index's "Built with" column, in the order you want them read.
tech: ['TypeScript', 'React', 'PostgreSQL']

featured: false

# Optional. Rendered as links in the spec column of the detail page.
links:
  - label: 'Live site'
    href: 'https://example.com'
  - label: 'GitHub'
    href: 'https://github.com/jordan-thrash/example'

# Drop a screenshot at this path (3:2 crops best). If the file doesn't exist,
# run `npm run covers` and a placeholder is generated for you.
cover: './covers/_example.webp'

draft: true
---

For a game, start with what the player does. Describe the idea, the goal, and the
choices or actions that make it interesting. Use details someone could recognize
in the screenshots or while playing.

For a tool, app, or service, explain who uses it and what it helps them do.

## My contribution

Describe your actual role and the parts you built. Credit collaborators where
appropriate. Include implementation details when they help explain the result,
such as how enemies react, how a generator shapes levels, or how a service
handles failures.

Keep it specific to this project. A short, accurate description is enough;
don't fill missing details with generic lessons or unverified features. Include a
playable build, video, or source link when one is available.
