---
title: Horror Maze Project
summary: A first-person horror game set in a procedurally generated maze, where the layout you learn is never the layout you get twice.
order: 80
year: '2022'
kind: Game
discipline: First-person horror
tech: ['Unity', 'C#', 'Procedural generation', 'AI']
featured: false
cover: './covers/horror-maze-project.png'
---

<!-- TODO: replace with the write-up from the old site's horror-maze-project.html -->

Horror works on the gap between what the player can see and what they can infer.
A procedural maze widens that gap permanently — there is no memorising the safe
route, because the route is generated fresh.

## Systems

Combining procedural generation with horror pacing is harder than it sounds. A
generator that does not understand tension will happily produce a layout with the
exit twenty feet from the spawn, or a dead end so long that the player gives up
before anything happens. The generation pass had to be constrained by pacing
requirements, not just connectivity.
