---
title: MyLogger
summary: 'A customizable logging utility for Unity: rich GameObject context, color-coded output and an in-game logger window.'
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

Unity's console is fine until twenty systems are logging at once. Then it turns
into a wall of undifferentiated gray text that never tells you which GameObject
said what. MyLogger fixes that.

## What it does

- **GameObject context.** Every log knows which object emitted it, so you can
  trace a message back to its source without gluing `name` into the string by
  hand.
- **Color-coded channels.** Categories read as distinct at a glance, so you can
  scan for the one system you care about instead of reading every line.
- **In-game logger window.** Logs surface in a build, not just in the editor.
  That pays for itself the first time you chase a bug that only reproduces in a
  player build.

## Why I built it

Debugging tools pay back more than almost anything else you write. Every hour
spent making failures easier to read comes back several times over, because the
gap between "something is wrong" and "I know what's wrong" is where the time
actually goes. MyLogger started as a file I kept copying between projects.
Eventually it earned being built properly.
