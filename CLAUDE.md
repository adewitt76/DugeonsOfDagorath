# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pure JavaScript port of "Dungeons of Daggorath" from the TRS-80 Color Computer. It's a browser-based dungeon crawler game using HTML5 Canvas for rendering with a retro aesthetic. The project uses vanilla JavaScript with ES6 modules - no frameworks or build tools required.

**Reference Material**: The original assembly source code is maintained in `../dungeons-of-daggorath-ASM` and can be consulted for understanding game mechanics and implementation details.

## Development Commands

- **Start development server**: `npm start` - Launches web-dev-server with auto-reload and opens browser
- **Main entry point**: `script.js` - Imports and starts the game

## Architecture

### Core Structure
- **Entry Point**: `script.js` → `src/game.js` (singleton Game class)
- **Rendering**: Double-buffered canvas system via `Stage` singleton (256x192 resolution)
- **Game Loop**: Browser's `requestAnimationFrame` drives the main loop in `Game.start()`

### Key Architectural Patterns
- **Singleton Pattern**: Extensively used for managers (Game, Stage, Player, AnimationManager, etc.)
- **MVC-like Structure**: 
  - Models: `src/models/` (Player, Level, Cell, Point, Font)
  - Views: `src/services/view_*.js` files handle all rendering
  - Services: Game logic, sound, animation management

### Game States
- `intro`: 21-second intro sequence with wizard animation
- `playing`: Main game loop with cell view, inventory, map views
- `game_over`: (implementation in progress)

### Player System
- **Views**: `PLAYER_VIEW` enum controls what's rendered (main_view, inventory_view, map_view_vision_scroll, map_view_seer_scroll)
- **Stats**: Power/damage system with heart beat healing
- **Movement**: Grid-based with directional facing and turning animations

### Rendering Pipeline
1. `Game.paint_main_window()` determines current view
2. Appropriate view service renders to offscreen canvas
3. `Stage.swapBuffers()` displays the completed frame

### Audio System
- Sound effects preloaded in `index.html`
- Background heartbeat system tied to player health

### Command System
- Text-based commands processed through `CommandManager`
- Supports abbreviated commands (e.g., 'm' for 'move', 't' for 'turn')

## Important Implementation Notes

- Pure JavaScript implementation using ES6 modules with `// @ts-check` for basic TypeScript checking
- No build step or transpilation required - runs directly in modern browsers
- Canvas rendering uses pixelated image-rendering for retro look
- Animation system handles intro sequences and turning animations
- Dungeon generation creates multi-level procedural dungeons
- Items include torches (pine, lunar, solar) and scrolls with different properties

## File Organization

- `src/models/`: Core game entities and data structures
- `src/services/`: Game systems (rendering, animation, sound, etc.)
- `src/items/`: Game objects with different behaviors
- `src/animations/`: Animation sequences
- `src/creatures/`: Enemy/NPC entities
- `assets/`: Audio files for game sounds