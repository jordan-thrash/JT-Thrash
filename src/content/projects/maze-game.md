---
title: Maze Gen Project
summary: A procedural maze generator built to compare generation algorithms by the quality of the mazes they produce, not just their runtime.
order: 95
year: '2019'
kind: Tool
discipline: Procedural generation
tech: ['Unity', 'C#', 'Procedural generation']
featured: false
links:
  - label: 'GitHub'
    href: 'https://github.com/jordan-thrash/MazeGen'
cover: './covers/maze-game.webp'
---

<!-- TODO: replace with the write-up from the old site's maze-game.html -->

A generator that builds mazes procedurally and renders them in Unity, written to
understand what actually separates the standard algorithms in practice.

## Systems

The differences between maze algorithms aren't about speed. They're about texture.
Depth-first search gives you long winding corridors with almost no branching.
Prim's gives you short, bushy, heavily branched layouts. Both count as "a maze"
and both solve instantly, but they feel nothing alike to walk through, and that's
the only measure that matters once a player has to be inside one.
