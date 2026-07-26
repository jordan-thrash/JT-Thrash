---
title: MyLogger
summary: A customizable logging utility for Unity — rich GameObject context, colour-coded output and an in-game logger window.
order: 100
year: '2024'
kind: Tool
discipline: Developer tooling
tech: ['Unity', 'C#', 'Editor tooling']
featured: true
links:
  - label: 'GitHub'
    href: 'https://github.com/orgs/Thrash-Gamedev/repositories'
cover: './covers/my-logger.png'
---

Unity's console is fine until you have twenty systems logging at once, at which
point it becomes a wall of undifferentiated grey text with no indication of which
GameObject said what. MyLogger fixes that.

## What it does

- **GameObject context** — every log knows which object emitted it, so you can
  trace a message back to a source without adding `name` to the string by hand.
- **Colour-coded channels** — categories are visually distinct, so you can scan
  for the one system you care about instead of reading every line.
- **In-game logger window** — logs surface in a build, not just in the editor.
  This is the part that pays for itself the first time you debug something that
  only reproduces in a player build.

## Why I built it

Debugging tools are the highest-leverage code in a game project. Every hour spent
making failures easier to read comes back several times over, because the loop
between "something is wrong" and "I know what is wrong" is where the time actually
goes. MyLogger started as a file I kept copying between projects, and eventually
it was worth making properly.
