# Dungeons of Daggorath

A faithful JavaScript port of the classic 1983 TRS-80 Color Computer game "Dungeons of Daggorath" - one of the first real-time, first-person perspective role-playing video games ever created.

![Dungeons of Daggorath](https://img.shields.io/badge/Platform-Browser-blue) ![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow) ![License](https://img.shields.io/badge/License-ISC-green)

## About the Original Game

Dungeons of Daggorath was developed by Douglas J. Morgan and Keith S. Kiyohara for DynaMicro and published by Tandy in 1983. It was groundbreaking for its time, featuring:

- **First-person 3D perspective** using wireframe graphics to create depth illusion
- **Real-time gameplay** - no turn-based combat here
- **Audio-driven gameplay** - your heartbeat indicates health, and unique sounds identify approaching monsters
- **Text command interface** - combining RPG mechanics with adventure game text parsing
- **Innovative torch system** - different torch types reveal different aspects of the dungeon

The game gained renewed fame as a plot point in Ernest Cline's novel "Ready Player One."

**Reference Material**: The original assembly source code is available at [dungeons-of-daggorath-asm](https://github.com/MichaelSpencerJr/DungeonsOfDaggorath) and can be consulted for understanding game mechanics and implementation details.

## This JavaScript Port

This is a pure JavaScript implementation that faithfully recreates the original game experience in modern web browsers. The port maintains the retro aesthetic and gameplay mechanics while leveraging HTML5 Canvas for rendering.

### Features

- **Authentic gameplay** - All original game mechanics preserved
- **Pure JavaScript** - No frameworks or build tools required
- **HTML5 Canvas rendering** - Pixelated graphics maintain the retro feel
- **Original audio** - Classic sound effects from the TRS-80 version
- **Multi-level dungeon** - Explore 5 levels of procedurally generated maze
- **Complete inventory system** - Torches, scrolls, shields, and other items
- **Real-time combat** - Face creatures like vipers, spiders, stone giants, and more

## Getting Started

### Prerequisites

- Node.js (for development server)
- Modern web browser with ES6 module support

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dungeons-of-daggorath.git
   cd dungeons-of-daggorath
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The game will open in your default browser at `http://localhost:8000`

## How to Play

### Basic Commands

- **MOVE** - Move forward in the direction you're facing
- **TURN LEFT/RIGHT** - Turn 90 degrees left or right
- **PULL LEFT/RIGHT [item]** - Take an item from your backpack into your hand
- **STOW LEFT/RIGHT** - Put the item from your hand back into your backpack
- **USE LEFT/RIGHT** - Use the item in your hand (torches, scrolls, flasks)
- **ATTACK LEFT/RIGHT** - Attack with the weapon in your hand
- **GET/DROP** - Pick up or drop items on the ground
- **REVEAL LEFT/RIGHT** - Identify unknown items

### Torch Types

- **Pine Torch** - Provides basic light but can't reveal secret passages
- **Lunar Torch** - Magical light that reveals hidden areas and some creatures
- **Solar Torch** - Most powerful light, reveals all creatures including scorpions

### Game Mechanics

- **Health System**: Your heartbeat is your health indicator - faster means weaker
- **Real-time Danger**: Monsters move and attack in real-time
- **Sound Cues**: Each creature makes unique sounds when nearby
- **Inventory Management**: Limited carrying capacity affects movement speed
- **Progressive Difficulty**: Deeper levels contain more dangerous creatures

### Survival Tips

1. Always keep a torch lit - you're blind without one
2. Listen for creature sounds to avoid ambushes
3. Manage your inventory - too much weight slows you down
4. REST command helps slow your heartbeat and recover
5. REVEAL items before using them for full effectiveness

## Project Structure

```
src/
├── animations/          # Animation sequences (intro, turning)
├── creatures/          # Monster classes and behaviors
├── items/             # Game objects (torches, scrolls, shields)
├── models/            # Core game entities (Player, Level, Cell)
└── services/          # Game systems (rendering, sound, commands)
```

### Key Files

- `script.js` - Main entry point
- `src/game.js` - Core game singleton and main loop
- `src/services/stage.js` - Canvas rendering system
- `src/services/command_manager.js` - Text command processing
- `src/services/dungeon_generator.js` - Procedural level generation

## Technical Details

- **Architecture**: Singleton pattern for core managers
- **Rendering**: Double-buffered canvas system (256x192 resolution)
- **Game Loop**: Browser's `requestAnimationFrame` drives updates
- **Module System**: ES6 modules with `// @ts-check` for basic type checking
- **No Build Process**: Runs directly in modern browsers

## Game States

- **Intro**: 21-second wizard animation sequence
- **Playing**: Main game with multiple view modes:
  - Cell view (first-person dungeon view)
  - Inventory view
  - Map view (with vision/seer scrolls)
- **Game Over**: (Implementation in progress)

## Contributing

This project maintains the original game's mechanics while adapting them for modern browsers. When contributing:

1. Preserve the authentic game experience
2. Follow the existing ES6 module structure
3. Maintain the retro aesthetic
4. Test across modern browsers
5. Reference the original assembly code when needed

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Original Developers**: Douglas J. Morgan, Keith S. Kiyohara, and Phil Landmeier
- **Original Publisher**: Tandy/Radio Shack
- **Graphics**: April Landmeier (monster designs)
- **Assembly Source**: [MichaelSpencerJr/DungeonsOfDaggorath](https://github.com/MichaelSpencerJr/DungeonsOfDaggorath) for reference

## Historical Significance

Dungeons of Daggorath holds a special place in gaming history as one of the first games to successfully combine:
- Real-time 3D graphics on 8-bit hardware
- Audio-driven gameplay mechanics
- Text adventure parsing with RPG combat
- Procedural dungeon generation

Experience this piece of gaming history faithfully recreated for the modern web!
