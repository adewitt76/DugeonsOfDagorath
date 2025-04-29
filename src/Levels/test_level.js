// @ts-check
import { Cell, DIRECTION, WALL_TYPE } from "../models/cell";
import { Level } from "./level";

export class TestLevel extends Level {

  /** @private @type { TestLevel } */
  static _instance;

  /** @private @type { Cell[][] } */
  _cells;

  /** @private */
  constructor() {
    super();
    this._cells = get_test_level();
  }

  /**
   * Get the instance of the stage
   * @returns { TestLevel }
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new TestLevel();
    return this._instance;
  }

  /**
    * Get an indvidual cell from the level map
    * @param { number } x
    * @param { number } y
    * @return { Cell }
    */
  getCell(x, y) {
    return this._cells[y][x];
  }
}

/**
  *     ^
  *     N         The cells are backward from the way
  * < W  E >      the coordinates are thought about.
  *    S          The 'x' access is the second number.
  *    v             `cells[y][x]`
  */

/**
  * Get a test level
  * @return { Cell[][] } cells [y][x]
  */
function get_test_level() {
  const cells = [
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
  ]

  ///////////////
  cells[0][0].is_empty = false;
  cells[0][0].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][0].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[0][0].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[0][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[0][0].cells[DIRECTION.south] = cells[1][0];
  cells[0][0].cells[DIRECTION.east] = cells[0][1];

  cells[0][1].is_empty = false;
  cells[0][1].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][1].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[0][1].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[0][1].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[0][1].cells[DIRECTION.east] = cells[0][2];
  cells[0][1].cells[DIRECTION.west] = cells[0][0];

  cells[0][2].is_empty = false;
  cells[0][2].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][2].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[0][2].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[0][2].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[0][2].cells[DIRECTION.south] = cells[1][2];
  cells[0][2].cells[DIRECTION.east] = cells[0][3];
  cells[0][2].cells[DIRECTION.west] = cells[0][1];

  cells[0][3].is_empty = false;
  cells[0][3].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][3].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[0][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[0][3].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[0][3].cells[DIRECTION.east] = cells[0][4];
  cells[0][3].cells[DIRECTION.west] = cells[0][2];

  cells[0][4].is_empty = false;
  cells[0][4].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][4].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[0][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[0][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[0][4].cells[DIRECTION.south] = cells[1][4];
  cells[0][4].cells[DIRECTION.west] = cells[0][3];

  ///////////////////////////////
  cells[1][0].is_empty = false;
  cells[1][0].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[1][0].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[1][0].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[1][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[1][0].cells[DIRECTION.north] = cells[0][0];
  cells[1][0].cells[DIRECTION.south] = cells[2][0];

  cells[1][2].is_empty = false;
  cells[1][2].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[1][2].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[1][2].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[1][2].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[1][2].cells[DIRECTION.north] = cells[0][2];
  cells[1][2].cells[DIRECTION.south] = cells[2][2];

  cells[1][4].is_empty = false;
  cells[1][4].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[1][4].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[1][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[1][4].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[1][4].cells[DIRECTION.north] = cells[0][4];
  cells[1][4].cells[DIRECTION.south] = cells[2][4];

  ///////////////////////////////
  cells[2][0].is_empty = false;
  cells[2][0].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[2][0].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[2][0].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[2][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[2][0].cells[DIRECTION.north] = cells[1][0];
  cells[2][0].cells[DIRECTION.south] = cells[3][0];
  cells[2][0].cells[DIRECTION.east] = cells[2][1];

  cells[2][1].is_empty = false;
  cells[2][1].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[2][1].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[2][1].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[2][1].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[2][1].cells[DIRECTION.east] = cells[2][2];
  cells[2][1].cells[DIRECTION.west] = cells[2][0];

  cells[2][2].is_empty = false;
  cells[2][2].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[2][2].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[2][2].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[2][2].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[2][2].cells[DIRECTION.north] = cells[1][2];
  cells[2][2].cells[DIRECTION.south] = cells[3][2];
  cells[2][2].cells[DIRECTION.east] = cells[2][3];
  cells[2][2].cells[DIRECTION.west] = cells[2][1];

  cells[2][3].is_empty = false;
  cells[2][3].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[2][3].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[2][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[2][3].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[2][3].cells[DIRECTION.east] = cells[2][4];
  cells[2][3].cells[DIRECTION.west] = cells[2][2];

  cells[2][4].is_empty = false;
  cells[2][4].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[2][4].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[2][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[2][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[2][4].cells[DIRECTION.north] = cells[1][4];
  cells[2][4].cells[DIRECTION.south] = cells[3][4];
  cells[2][4].cells[DIRECTION.west] = cells[2][3];

  ///////////////////////////////
  cells[3][0].is_empty = false;
  cells[3][0].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[3][0].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][0].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[3][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[3][0].cells[DIRECTION.north] = cells[2][0];
  cells[3][0].cells[DIRECTION.south] = cells[4][0];

  cells[3][2].is_empty = false;
  cells[3][2].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[3][2].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][2].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[3][2].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[3][2].cells[DIRECTION.north] = cells[2][2];
  cells[3][2].cells[DIRECTION.south] = cells[4][2];

  cells[3][4].is_empty = false;
  cells[3][4].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[3][4].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[3][4].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[3][4].cells[DIRECTION.north] = cells[2][4];
  cells[3][4].cells[DIRECTION.south] = cells[4][4];

  /////////////////////////////////////
  cells[4][0].is_empty = false;
  cells[4][0].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][0].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][0].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[4][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[4][0].cells[DIRECTION.north] = cells[3][0];
  cells[4][0].cells[DIRECTION.east] = cells[4][1];

  cells[4][1].is_empty = false;
  cells[4][1].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[4][1].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][1].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[4][1].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[4][1].cells[DIRECTION.east] = cells[4][2];
  cells[4][1].cells[DIRECTION.west] = cells[4][0];

  cells[4][2].is_empty = false;
  cells[4][2].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][2].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][2].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[4][2].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[4][2].cells[DIRECTION.north] = cells[3][2];
  cells[4][2].cells[DIRECTION.east] = cells[4][3];
  cells[4][2].cells[DIRECTION.west] = cells[4][1];

  cells[4][3].is_empty = false;
  cells[4][3].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[4][3].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[4][3].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[4][3].cells[DIRECTION.east] = cells[4][4];
  cells[4][3].cells[DIRECTION.west] = cells[4][2];

  cells[4][4].is_empty = false;
  cells[4][4].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][4].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[4][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[4][4].cells[DIRECTION.north] = cells[3][4];
  cells[4][4].cells[DIRECTION.west] = cells[4][3];

  return cells;
}

