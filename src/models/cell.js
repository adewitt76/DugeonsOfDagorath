// @ts-check
import { Item } from '../items/item.js';
import { Creature } from '../creatures/creature.js';

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
  static get ladder_up() { return 1 }
  static get ladder_down() { return 2 }
  static get hole_ceiling() { return 3 }
  static get hole_floor() { return 4 }
};

export class Cell {
  constructor() {
    this.is_solid = true;
    this.cells = [];
    this.walls = [];
    this.center = ROOM_CENTER.normal;
    this.inventory = [];
    this.cell_above = null;
    this.cell_below = null;
  }

  /** @type { boolean } */
  is_solid;

  /** @type { Cell[] } connecting cells N,S,E,W **/
  cells;

  /** @type { WALL_TYPE[] } */
  walls;

  /** @type { ROOM_CENTER } */
  center;

  /** @type { Item[] } */
  inventory;

  /** @type { Creature } */
  creature;

  /** @type { Cell | null } */
  cell_above;

  /** @type { Cell | null } */
  cell_below;
}
