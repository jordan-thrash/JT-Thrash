---
title: Horror Maze Project
summary: A first-person horror game set in a procedurally generated maze, where the layout you learn is never the layout you get twice.
order: 80
year: '2022'
kind: Game
discipline: First-person horror
tech: ['Unity', 'C#', 'Procedural generation', 'AI']
featured: false
cover: './covers/horror-maze-project.webp'
---

<!-- TODO: replace with the write-up from the old site's horror-maze-project.html -->

Horror works on the gap between what the player can see and what they can infer.
A procedural maze widens that gap permanently. There's no memorizing the safe
route, because the route changes every run.

## Systems

Combining procedural generation with horror pacing is harder than it sounds. A
generator that doesn't understand tension will happily put the exit twenty feet
from the spawn, or build a dead end so long the player quits before anything
happens. So the generation pass answers to pacing rules, not just connectivity.
