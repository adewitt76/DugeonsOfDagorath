// @ts-check
import { Level } from "./level";
import { ROOM_CENTER, WALL_TYPE, DIRECTION, Cell } from "../models/cell";
import { Point } from "../models/point";
import { MAP_SIZE } from "../services/map_generator";
import { Random } from "../services/random";

const LEVEL_COUNT = 5;

export class LevelList {

  /** @private @type { Level[] } */
  _levels;

  /** @private */
  constructor() {
    this._levels = new Array(5);
    this._generate_Levels();
  }

  /** Get the instance of the stage
   * @returns { LevelList }
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new LevelList();
    return this._instance;
  }

  /** Get level map
    * @param { number } level
    * @return { Cell[][] }
    */
  getLevelMap(level) {
    return this._levels[level].cells;
  }

  /** Get a location to start the player
    * @param { number } level
    * @param { number } x
    * @param { number } y
    * @return { Cell }
    */
  getCell(level, x, y) {
    return this._levels[level].getCell(x, y);
  }

  /** Get a location to start the player
    * @return { Point }
    */
  get player_starting_location() {
    let x;
    let y;
    let found = false;
    do {
      x = Random.instance.number % MAP_SIZE;
      y = Random.instance.number % MAP_SIZE;
      const cell = this._levels[0].getCell(x, y);
      if (!cell.is_empty &&
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
    * @return { DIRECTION } a good starting direction;
    */
  get_player_starting_direction(location) {
    /** @type { DIRECTION } */
    let direction;
    let found = false;
    const cell = this._levels[0].getCell(location.x, location.y);
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

  /** @private */
  _generate_Levels() {
    for (let i = 0; i < LEVEL_COUNT; i++) {
      this._levels[i] = new Level(Date.now());
    }
  }
}

