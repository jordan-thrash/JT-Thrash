---
title: Maze Gen Project
summary: A procedural maze generator built to compare generation algorithms by the quality of the mazes they produce, not just their runtime.
order: 95
year: '2019'
kind: Tool
tech: ['Unity', 'C#', 'Procedural generation']
featured: false
links:
  - label: 'GitHub'
    href: 'https://github.com/jordan-thrash/MazeGen'
cover: './covers/maze-game.png'
---

<!-- TODO: replace with the write-up from the old site's maze-game.html -->

A generator that builds mazes procedurally and renders them in Unity, written to
understand what actually separates the standard algorithms in practice.

## Systems

The measurable differences between maze algorithms are not really about speed —
they are about texture. Depth-first search produces long winding corridors with
few branches; Prim's produces short, bushy, heavily-branched layouts. Both are
"a maze" and both solve instantly, but they feel completely different to walk
through, which is the only metric that matters if a player is going to be inside
one.
