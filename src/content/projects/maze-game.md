---
title: Maze Gen Project
summary: A configurable maze generator with a first-person game for exploring the result.
order: 95
kind: Tool
discipline: Procedural generation
tech: ['Unity', 'C#', "Prim's algorithm"]
featured: false
links:
  - label: 'GitHub'
    href: 'https://github.com/jordan-thrash/MazeGen'
cover: './covers/maze-game.webp'
---

## From a generated layout to a place to explore

This project generates a maze that you can walk through in first person,
collecting coins as you search for the exit. Playing inside the result gives the
generator a purpose beyond drawing a pattern on a grid.

## Controls for level design

I used Prim's algorithm to generate the layouts and made the construction
modular. A level designer can choose floor and wall types and configure randomly
placed objects. The grid size, path dimensions, and random seed are adjustable.

The generator handles construction. Those controls let a designer change both
the layout and its visual setting without placing every wall by hand.

<!-- Source: indexed original portfolio page,
https://jordanthrash.weebly.com/maze-game.html. -->
