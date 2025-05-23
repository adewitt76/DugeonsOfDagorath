// @ts-check
import { Level, MAP_SIZE } from '../Levels/level.js';
import { DIRECTION, ROOM_CENTER, WALL_TYPE } from '../models/cell.js';
import { Point } from '../models/point.js';
import { Random } from './random.js';

/**
 * Represents a quadrant in the dungeon map
 * @typedef {Object} Quadrant
 * @property {number} startX - Starting X coordinate
 * @property {number} startY - Starting Y coordinate
 * @property {number} endX - Ending X coordinate
 * @property {number} endY - Ending Y coordinate
 */

export class DungeonGenerator {
  /**
   * Generates a complete dungeon with all levels and vertical connections
   * @returns {Level[]} Array of dungeon levels, where each level is a 2D array of cells
   */
  generateDungeon() {
    // Generate 5 levels
    const levels = Array(5).fill(null).map(() => this._generateLevel());

    // Create vertical connections between levels
    this._connectLevels1And2(levels[0], levels[1]);
    this._connectLevels2And3(levels[1], levels[2]);
    // No connections between levels 3 and 4
    this._connectLevels4And5(levels[3], levels[4]);

    return levels;
  }

  /** Get a location to start the player
    * @param { Level } level 
    * @return { Point }
    */
  generate_player_starting_location(level) {
    let x;
    let y;
    let found = false;
    do {
      x = Random.instance.number % MAP_SIZE;
      y = Random.instance.number % MAP_SIZE;
      const cell = level.getCell(x, y);
      if (!cell.is_solid &&
        cell.center === ROOM_CENTER.normal &&
        cell.walls.some(w => w === WALL_TYPE.open)
        // TODO: add enemy check
      ) {
        found = true;
      }
    } while (!found);
    return new Point(x, y);
  }

  /** Get a good starting direction
    * @param { Point } location starting location
    * @param { Level } level 
    * @return { DIRECTION } a good starting direction;
    */
  generate_player_starting_direction(location, level) {
    /** @type { DIRECTION } */
    let direction;
    let found = false;
    const cell = level.getCell(location.x, location.y);
    let d = Random.instance.number % 4;
    do {
      if (d > 4) d = 0;
      switch (d) {
        case 0:
          direction = DIRECTION.north;
          break;
        case 1:
          direction = DIRECTION.south;
          break;
        case 2:
          direction = DIRECTION.east;
          break;
        default:
          direction = DIRECTION.west;
      }
      found = cell.walls[ /**@type{number}*/(direction)] === WALL_TYPE.open;
      ++d;
    } while (!found);
    return direction;
  }

  /**
   * Generates a single level of the dungeon
   * @private
   * @returns { Level } 2D array of cells representing one level
   */
  _generateLevel() {
    const level = new Level();
    return level;
  }

  /**
   * Gets the quadrants of the map
   * @private
   * @returns {Quadrant[]} Array of quadrant definitions
   */
  _getQuadrants() {
    const halfSize = Math.floor(MAP_SIZE / 2);
    return [
      // Quadrant 1: Top-left
      {
        startX: 0,
        startY: 0,
        endX: halfSize - 1,
        endY: halfSize - 1
      },
      // Quadrant 2: Top-right
      {
        startX: 0,
        startY: halfSize,
        endX: halfSize - 1,
        endY: MAP_SIZE - 1
      },
      // Quadrant 3: Bottom-left
      {
        startX: halfSize,
        startY: 0,
        endX: MAP_SIZE - 1,
        endY: halfSize - 1
      },
      // Quadrant 4: Bottom-right
      {
        startX: halfSize,
        startY: halfSize,
        endX: MAP_SIZE - 1,
        endY: MAP_SIZE - 1
      }
    ];
  }

  /**
   * Finds a suitable non-solid cell in a quadrant
   * @private
   * @param {Level} level_a The dungeon level
   * @param {Level} level_b The dungeon level
   * @param {Quadrant} quadrant The quadrant to search in
   * @returns {{x: number, y: number}} Coordinates of a suitable cell
   */
  _findSuitableCellInQuadrant(level_a, level_b, quadrant) {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const x = Math.floor(Math.random() * (quadrant.endX - quadrant.startX + 1)) + quadrant.startX;
      const y = Math.floor(Math.random() * (quadrant.endY - quadrant.startY + 1)) + quadrant.startY;

      const cell_a = level_a.cells[x][y];
      const cell_b = level_b.cells[x][y];
      if ((!cell_a.is_solid && cell_a.center === ROOM_CENTER.normal) && (!cell_b.is_solid && cell_b.center === ROOM_CENTER.normal)) {
        return { x, y };
      }

      attempts++;
    }

    throw new Error('Could not find suitable cell for vertical connection');
  }

  /**
   * Creates vertical connections between levels 1 and 2
   * @private
   * @param {Level} level1 Level 1 of the dungeon
   * @param {Level} level2 Level 2 of the dungeon
   */
  _connectLevels1And2(level1, level2) {
    const quadrants = this._getQuadrants();
    const shuffledQuadrants = [...quadrants].sort(() => Math.random() - 0.5);

    // Two ladders and two holes
    for (let i = 0; i < 4; i++) {
      const isLadder = i < 2; // First two connections are ladders
      const { x, y } = this._findSuitableCellInQuadrant(level1, level2, shuffledQuadrants[i]);

      if (isLadder) {
        level1.cells[x][y].center = ROOM_CENTER.ladder_down;
        level2.cells[x][y].center = ROOM_CENTER.ladder_up;
      } else {
        level1.cells[x][y].center = ROOM_CENTER.hole_floor;
        level2.cells[x][y].center = ROOM_CENTER.hole_ceiling;
      }

      // Link cells vertically
      level1.cells[x][y].cell_below = level2.cells[x][y];
      level2.cells[x][y].cell_above = level1.cells[x][y];
    }
  }

  /**
   * Creates vertical connections between levels 2 and 3
   * @private
   * @param {Level} level2 Level 2 of the dungeon
   * @param {Level} level3 Level 3 of the dungeon
   */
  _connectLevels2And3(level2, level3) {
    const quadrants = this._getQuadrants();
    const shuffledQuadrants = [...quadrants].sort(() => Math.random() - 0.5);

    // Three holes and one ladder
    for (let i = 0; i < 4; i++) {
      const isLadder = i === 0; // First connection is a ladder
      const { x, y } = this._findSuitableCellInQuadrant(level2, level3, shuffledQuadrants[i]);

      if (isLadder) {
        level2.cells[x][y].center = ROOM_CENTER.ladder_down;
        level3.cells[x][y].center = ROOM_CENTER.ladder_up;
      } else {
        level2.cells[x][y].center = ROOM_CENTER.hole_floor;
        level3.cells[x][y].center = ROOM_CENTER.hole_ceiling;
      }

      // Link cells vertically
      level2.cells[x][y].cell_below = level3.cells[x][y];
      level3.cells[x][y].cell_above = level2.cells[x][y];
    }
  }

  /**
   * Creates vertical connections between levels 4 and 5
   * @private
   * @param {Level} level4 Level 4 of the dungeon
   * @param {Level} level5 Level 5 of the dungeon
   */
  _connectLevels4And5(level4, level5) {
    const quadrants = this._getQuadrants();

    // Four holes, one in each quadrant
    for (let i = 0; i < 4; i++) {
      const { x, y } = this._findSuitableCellInQuadrant(level4, level5, quadrants[i]);

      level4.cells[x][y].center = ROOM_CENTER.hole_floor;
      level5.cells[x][y].center = ROOM_CENTER.hole_ceiling;

      // Link cells vertically
      level4.cells[x][y].cell_below = level5.cells[x][y];
      level5.cells[x][y].cell_above = level4.cells[x][y];
    }
  }
}
