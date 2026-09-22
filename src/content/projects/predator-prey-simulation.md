---
title: Predator / Prey Simulation
summary: Predators hunt while prey flock together and seek shelter in a Unity AI simulation.
order: 105
kind: Game
discipline: Agent simulation
tech: ['Unity', 'C#', 'AI', 'Steering behaviors']
featured: false
cover: './covers/predator-prey-simulation.webp'
---

## Hunters, shelters, and a moving flock

This university course project simulates predators and prey sharing an arena.
Prey move in groups as they wander. When predators approach, they look for
shelter. Predators search for prey while avoiding obstacles and eliminate them
on contact.

## How the agents behave

Each agent sees through raycasts. Arrays of these checks report what surrounds
it, while a state pattern organizes seeking, wandering, and avoidance according
to whether the agent is a predator or prey. Flocking behavior keeps the prey moving together, while
shelters give them places to hide.

Steering and physics translate those decisions into movement. Vector and
quaternion math control the agents' positions and orientation.

<!-- Source: https://jordanthrash.weebly.com/predator-prey-simulation.html.
The original describes a course project with steering and AI states, not a
population model. Removed unsupported equilibrium, reproduction, and
Lotka–Volterra claims from the previous migration. -->
