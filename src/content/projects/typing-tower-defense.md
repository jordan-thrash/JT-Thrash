---
title: Typing War
summary: Defend a castle by typing away monsters and spending your earnings on turrets and upgrades.
order: 110
kind: Game
discipline: Typing tower defense
tech: ['Unity', 'C#', 'Gameplay systems']
featured: true
cover: './covers/typing-tower-defense.webp'
---

## Keep the castle standing

Monsters approach your castle with words to type. Completing a word takes down
its enemy, but typing speed is only part of the game. You earn coins to spend on upgrades and automatic turrets, making decisions
about your defenses as tougher enemies threaten the castle's health.

The result combines the immediate pressure of a typing game with decisions
about how to strengthen your defenses.

## Building the defense

The gameplay connects keyboard input to the words assigned to enemies, while
the spawning and level systems control what the player faces next. I also built
the health, coin, and upgrade logic around that loop.

Enemies and bullets use object pooling. Reusing those objects keeps the game
from creating and destroying them with every spawn or shot.

<!-- Source: indexed original portfolio page,
https://jordanthrash.weebly.com/typing-tower-defense.html.
Removed unsupported claims about accuracy being the only damage stat and
input-target arbitration being most of the design work. -->
