---
title: Typing War
summary: A tower defense game where your keyboard is the weapon — enemies fall to typed words, and accuracy is the only damage stat that matters.
order: 110
year: '2024'
kind: Game
tech: ['Unity', 'C#', 'Gameplay systems']
featured: true
cover: './covers/typing-tower-defense.png'
---

<!-- TODO: replace with the write-up from the old site's typing-tower-defense.html -->

Typing War puts a typing trainer inside a tower defense loop. Enemies advance,
each carrying a word, and the only way to stop them is to type it correctly before
they reach the line. Speed decides how many you can handle; accuracy decides
whether you get to try again.

## Systems

The interesting problem here is input arbitration. When six enemies are on screen
and the player starts typing, the game has to decide which target they meant —
and commit to it in a way that feels fair rather than arbitrary. Getting that
resolution rule right was most of the design work.
