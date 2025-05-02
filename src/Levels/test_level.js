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

  /**
   * Get the cell grid
   * @returns { Cell[][] }
   */
  get cells() {
    return this._cells;
  }

  /**
   * Get the cell grid
   * @param { Cell[][] } cells
   */
  set cells(cells) {
    this._cells = cells;
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
    //     0           1           2             3           4          5           6           7              8           9          10 
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  0
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  1
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  2

    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  3
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  4
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  5
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  6
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  7

    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  8
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], //  9
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()], // 10
  ]
  ////////////////
  cells[0][5].is_empty = false;
  cells[0][5].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[0][5].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[0][5].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[0][5].cells[DIRECTION.south] = cells[1][5];

  ///////////////
  cells[1][5].is_empty = false;
  cells[1][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[1][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[1][5].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[1][5].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[1][5].cells[DIRECTION.north] = cells[0][5];
  cells[1][5].cells[DIRECTION.south] = cells[2][5];

  ///////////////
  cells[2][5].is_empty = false;
  cells[2][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[2][5].walls[DIRECTION.south] = WALL_TYPE.normal_door;
  cells[2][5].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[2][5].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[2][5].cells[DIRECTION.north] = cells[1][5];
  cells[2][5].cells[DIRECTION.south] = cells[3][5];

  ///////////////
  cells[3][3].is_empty = false;
  cells[3][3].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[3][3].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[3][3].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[3][3].cells[DIRECTION.south] = cells[4][3];
  cells[3][3].cells[DIRECTION.east] = cells[3][4];

  cells[3][4].is_empty = false;
  cells[3][4].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[3][4].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[3][4].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[3][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[3][4].cells[DIRECTION.east] = cells[3][5];
  cells[3][4].cells[DIRECTION.west] = cells[3][3];

  cells[3][5].is_empty = false;
  cells[3][5].walls[DIRECTION.north] = WALL_TYPE.normal_door;
  cells[3][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][5].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[3][5].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[3][5].cells[DIRECTION.north] = cells[2][5];
  cells[3][5].cells[DIRECTION.south] = cells[4][5];
  cells[3][5].cells[DIRECTION.east] = cells[3][6];
  cells[3][5].cells[DIRECTION.west] = cells[3][4];

  cells[3][6].is_empty = false;
  cells[3][6].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[3][6].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[3][6].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[3][6].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[3][6].cells[DIRECTION.east] = cells[3][7];
  cells[3][6].cells[DIRECTION.west] = cells[3][5];

  cells[3][7].is_empty = false;
  cells[3][7].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[3][7].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][7].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[3][7].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[3][7].cells[DIRECTION.south] = cells[4][7];
  cells[3][7].cells[DIRECTION.west] = cells[3][6];

  ///////////////////////////////
  cells[4][3].is_empty = false;
  cells[4][3].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][3].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[4][3].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[4][3].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[4][3].cells[DIRECTION.north] = cells[3][3];
  cells[4][3].cells[DIRECTION.south] = cells[5][3];

  cells[4][5].is_empty = false;
  cells[4][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[4][5].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[4][5].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[4][5].cells[DIRECTION.north] = cells[3][5];
  cells[4][5].cells[DIRECTION.south] = cells[5][5];

  cells[4][7].is_empty = false;
  cells[4][7].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][7].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[4][7].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[4][7].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[4][7].cells[DIRECTION.north] = cells[3][7];
  cells[4][7].cells[DIRECTION.south] = cells[5][7];

  ///////////////////////////////
  cells[5][3].is_empty = false;
  cells[5][3].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[5][3].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[5][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[5][3].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[5][3].cells[DIRECTION.north] = cells[4][3];
  cells[5][3].cells[DIRECTION.south] = cells[6][3];
  cells[5][3].cells[DIRECTION.east] = cells[5][4];

  cells[5][4].is_empty = false;
  cells[5][4].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[5][4].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[5][4].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[5][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[5][4].cells[DIRECTION.east] = cells[5][5];
  cells[5][4].cells[DIRECTION.west] = cells[5][3];

  cells[5][5].is_empty = false;
  cells[5][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[5][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[5][5].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[5][5].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[5][5].cells[DIRECTION.north] = cells[4][5];
  cells[5][5].cells[DIRECTION.south] = cells[6][5];
  cells[5][5].cells[DIRECTION.east] = cells[5][6];
  cells[5][5].cells[DIRECTION.west] = cells[5][4];

  cells[5][6].is_empty = false;
  cells[5][6].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[5][6].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[5][6].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[5][6].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[5][6].cells[DIRECTION.east] = cells[5][7];
  cells[5][6].cells[DIRECTION.west] = cells[5][5];

  cells[5][7].is_empty = false;
  cells[5][7].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[5][7].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[5][7].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[5][7].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[5][7].cells[DIRECTION.north] = cells[4][7];
  cells[5][7].cells[DIRECTION.south] = cells[6][7];
  cells[5][7].cells[DIRECTION.west] = cells[5][6];

  ///////////////////////////////
  cells[6][3].is_empty = false;
  cells[6][3].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[6][3].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[6][3].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[6][3].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[6][3].cells[DIRECTION.north] = cells[5][3];
  cells[6][3].cells[DIRECTION.south] = cells[7][3];

  cells[6][5].is_empty = false;
  cells[6][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[6][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[6][5].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[6][5].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[6][5].cells[DIRECTION.north] = cells[5][5];
  cells[6][5].cells[DIRECTION.south] = cells[7][5];

  cells[6][7].is_empty = false;
  cells[6][7].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[6][7].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[6][7].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[6][7].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[6][7].cells[DIRECTION.north] = cells[5][7];
  cells[6][7].cells[DIRECTION.south] = cells[7][7];

  /////////////////////////////////////
  cells[7][3].is_empty = false;
  cells[7][3].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[7][3].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[7][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[7][3].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[7][3].cells[DIRECTION.north] = cells[6][3];
  cells[7][3].cells[DIRECTION.east] = cells[7][4];

  cells[7][4].is_empty = false;
  cells[7][4].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[7][4].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[7][4].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[7][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[7][4].cells[DIRECTION.east] = cells[7][5];
  cells[7][4].cells[DIRECTION.west] = cells[7][3];

  cells[7][5].is_empty = false;
  cells[7][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[7][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[7][5].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[7][5].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[7][5].cells[DIRECTION.north] = cells[6][5];
  cells[7][5].cells[DIRECTION.south] = cells[8][5];
  cells[7][5].cells[DIRECTION.east] = cells[7][6];
  cells[7][5].cells[DIRECTION.west] = cells[7][4];

  cells[7][6].is_empty = false;
  cells[7][6].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[7][6].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[7][6].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[7][6].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[7][6].cells[DIRECTION.east] = cells[7][7];
  cells[7][6].cells[DIRECTION.west] = cells[7][5];

  cells[7][7].is_empty = false;
  cells[7][7].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[7][7].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[7][7].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[7][7].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[7][7].cells[DIRECTION.north] = cells[6][7];
  cells[7][7].cells[DIRECTION.west] = cells[7][6];

  ////////////////
  cells[8][5].is_empty = false;
  cells[8][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[8][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[8][5].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[8][5].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[8][5].cells[DIRECTION.north] = cells[7][5];
  cells[8][5].cells[DIRECTION.south] = cells[9][5];

  ///////////////
  cells[9][5].is_empty = false;
  cells[9][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[9][5].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[9][5].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[9][5].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[9][5].cells[DIRECTION.north] = cells[8][5];
  cells[9][5].cells[DIRECTION.south] = cells[10][5];

  ///////////////
  cells[10][5].is_empty = false;
  cells[10][5].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[10][5].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[10][5].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[10][5].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[10][5].cells[DIRECTION.north] = cells[9][5];

  return cells;
}

