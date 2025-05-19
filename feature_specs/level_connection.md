# Dungeon Level Connection Feature Specification

## Overview

This document outlines the requirements for implementing vertical connections (ladders and holes) between dungeon levels in the Dungeons of Daggorath game. Currently, levels are randomly generated but lack vertical connections between them. This feature will add ladders and holes that allow players to move between levels.

## Requirements

### Cell Model Enhancement

The `Cell` class needs to be extended to support vertical connections:

1. Add properties to indicate vertical connections:
   - `has_ladder_up`: Boolean indicating if the cell has a ladder going up
   - `has_ladder_down`: Boolean indicating if the cell has a ladder going down
   - `has_hole_ceiling`: Boolean indicating if the cell has a hole in the ceiling
   - `has_hole_floor`: Boolean indicating if the cell has a hole in the floor

2. Add references to connected cells on adjacent levels:
   - `cell_above`: Reference to the cell on the level above
   - `cell_below`: Reference to the cell on the level below

### Level Connection Rules

#### Level 1 to Level 2
- Two ladders and two holes must be generated
- Each connection must be in a different quadrant of the map
- Distribution:
  - Quadrant 1: One ladder or hole
  - Quadrant 2: One ladder or hole
  - Quadrant 3: One ladder or hole
  - Quadrant 4: One ladder or hole

#### Level 2 to Level 3
- Three holes and one ladder must be generated
- Each connection must be in a different quadrant of the map
- Distribution:
  - Quadrant 1: One hole or ladder
  - Quadrant 2: One hole or ladder
  - Quadrant 3: One hole or ladder
  - Quadrant 4: One hole or ladder

#### Level 3 to Level 4
- No connections between these levels

#### Level 4 to Level 5
- Four holes must be generated
- Each hole must be in a different quadrant of the map
- Distribution:
  - Quadrant 1: One hole
  - Quadrant 2: One hole
  - Quadrant 3: One hole
  - Quadrant 4: One hole

### Constraints

1. Only one vertical connection (ladder or hole) can exist in any cell
2. Vertical connections between any two levels must each be in their own quadrant
3. Cells with vertical connections must not be solid cells
4. Vertical connections should be placed in accessible areas of the dungeon

## Implementation Details

### Map Division into Quadrants

The map should be divided into four equal quadrants:
- Quadrant 1: Top-left (0,0) to (MAP_SIZE/2-1, MAP_SIZE/2-1)
- Quadrant 2: Top-right (0, MAP_SIZE/2) to (MAP_SIZE/2-1, MAP_SIZE-1)
- Quadrant 3: Bottom-left (MAP_SIZE/2, 0) to (MAP_SIZE-1, MAP_SIZE/2-1)
- Quadrant 4: Bottom-right (MAP_SIZE/2, MAP_SIZE/2) to (MAP_SIZE-1, MAP_SIZE-1)

### Connection Generation Algorithm

1. For each pair of adjacent levels that require connections:
   - Determine the number and type of connections needed
   - For each quadrant that needs a connection:
     - Randomly select a non-solid cell in the quadrant
     - Verify the cell doesn't already have a vertical connection
     - Create the appropriate connection (ladder up/down or hole ceiling/floor)
     - Create the corresponding connection in the cell on the adjacent level
     - Link the two cells together via `cell_above` and `cell_below` references

2. When generating connections:
   - A ladder down in one level corresponds to a ladder up in the level below
   - A hole in the floor in one level corresponds to a hole in the ceiling in the level below

### Visual Representation

The game should visually represent these connections in the dungeon view. The following drawing instructions should be implemented in the CellView class:

#### Ladder Drawing Instructions
```
Move to absolute (116,24)
Line to absolute (116,128)
Move to absolute (140,24)
Line to absolute (140,128)
Move to absolute (116,28)
Line to absolute (140,28)
Move to absolute (116,40)
Line to absolute (140,40)
Move to absolute (116,52)
Line to absolute (140,52)
Move to absolute (116,64)
Line to absolute (140,64)
Move to absolute (116,76)
Line to absolute (140,76)
Move to absolute (116,88)
Line to absolute (140,88)
Move to absolute (116,100)
Line to absolute (140,100)
Move to absolute (116,112)
Line to absolute (140,112)
Move to absolute (116,123)
Line to absolute (140,123)
```

#### Hole in Ceiling Drawing Instructions
```
Move to absolute (100,34)
Line to absolute (92,24)
Line to absolute (164,24)
Line to absolute (156,34)
Line to absolute (100,34)
Line to absolute (100,24)
Move to absolute (156,34)
Line to absolute (156,24)
Move to absolute (47,28)
Line to absolute (96,28)
Move to absolute (161,28)
Line to absolute (210,28)
```

#### Hole in Floor Drawing Instructions
```
Move to absolute (100,118)
Line to absolute (92,128)
Line to absolute (164,128)
Line to absolute (156,118)
Line to absolute (100,118)
Line to absolute (100,128)
Move to absolute (156,118)
Line to absolute (156,128)
Move to absolute (47,28)
Line to absolute (210,28)
```

## Technical Considerations

1. The `DungeonGenerator` class will need to be modified to:
   - Generate multiple levels at once
   - Create connections between levels according to the specified rules
   - Ensure connections are properly aligned between levels

2. The `CellView` class will need to be extended to:
   - Add methods to draw ladders up/down
   - Add methods to draw holes in ceiling/floor
   - Integrate these drawing methods into the existing paint method
   - Apply appropriate light levels to vertical connections

3. Player movement mechanics will need to be updated to:
   - Allow climbing up/down ladders with specific commands (e.g., "CLIMB UP", "CLIMB DOWN")
   - There should not be any falling through a hole
   - Allow climbing down through a hole but do not allow climbing up
   - Handle transitions between levels, including updating the player's position on the new level
   - Update the player's field of view when entering a new level

## User Interface and Feedback

1. Visual Feedback:
   - When a player is in a cell with a ladder or hole, it should be clearly visible in the first-person view
   - The light level should affect the visibility of ladders and holes according to the standard lighting rules
   - Magic light should not illuminate ladders and holes Lighting should be only natural light

2. Command Interface:
   - Add new commands for interacting with vertical connections:
     - "CLIMB UP" and "C U" - Use when standing on a cell with a ladder going up
     - "CLIMB DOWN" and "C D" - Use when standing on a cell with a ladder going down or a hole in the floor

## Testing

No Tests

