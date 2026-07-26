---
title: Predator / Prey Simulation
summary: An ecosystem simulation where predator and prey populations find their own equilibrium — or collapse trying.
order: 105
year: '2024'
kind: Game
discipline: Agent simulation
tech: ['Unity', 'C#', 'AI', 'Simulation']
featured: true
cover: './covers/predator-prey-simulation.png'
---

<!-- TODO: replace with the write-up from the old site's predator-prey-simulation.html -->

A simulation of the classic predator/prey dynamic, built to watch the
Lotka–Volterra oscillation emerge from individual agent behaviour rather than
being imposed by an equation.

## Systems

Each agent runs its own small decision loop — seek food, avoid threats,
reproduce when it has the energy budget for it. Nothing in the code knows about
population curves. The oscillation is a consequence, which is exactly what makes
it interesting to watch: tune one agent-level constant and the whole system finds
a different equilibrium, or fails to find one at all.
