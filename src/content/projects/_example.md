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
year: '2026'

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
cover: './covers/_example.png'

draft: true
---

Open with the problem, not the tech. What did this need to do, and what made
that hard?

## Systems

The part worth reading: the decision that was not obvious, the constraint that
shaped the design, the thing that broke and what you changed. One or two
paragraphs beats a feature list.

## Takeaways

- What you would do the same way again.
- What you would not.
