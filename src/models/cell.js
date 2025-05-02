// @ts-check
import { Item } from './item.js';

export class DIRECTION {
  static get north() { return 0 }
  static get south() { return 1 }
  static get east() { return 2 }
  static get west() { return 3 }
};

export class WALL_TYPE {
  static get open() { return 0 }
  static get normal_door() { return 1 }
  static get magic_door() { return 2 }
  static get solid() { return 3 }
};

export class ROOM_CENTER {
  static get normal() { return 0 }
};

export class Cell {
  constructor() {
    this.is_empty = true;
    this.cells = [];
    this.walls = [];
    this.center = ROOM_CENTER.normal;
    this.inventory = [];
  }

  /** @type { boolean } */
  is_empty;

  /** @type { Cell[] } connecting cells N,S,E,W **/
  cells;

  /** @type { WALL_TYPE[] } */
  walls;

  /** @type { ROOM_CENTER } */
  center;

  /** @type { Item[] } */
  inventory;
}
