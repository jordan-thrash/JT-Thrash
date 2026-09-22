---
title: MyLogger
summary: A Unity logging utility with GameObject context, color-coded output, and a log window you can use while playing.
order: 100
kind: Tool
discipline: Developer tooling
tech: ['Unity', 'C#', 'Editor tooling']
featured: false
links:
  - label: 'Game development repositories'
    href: 'https://github.com/orgs/Thrash-Gamedev/repositories'
cover: './covers/my-logger.webp'
---

MyLogger adds context and formatting to Unity logs so it's easier to follow what
individual objects and systems are doing during a playtest.

## Reading a running game

- **GameObject context** connects a message to the object that produced it.
- **Color-coded output** makes different kinds of messages easier to distinguish.
- **An in-game log window** lets you inspect messages while the game is running.

It's a small tool for a recurring part of game development: figuring out why the
behavior on screen doesn't match the behavior you expected.
