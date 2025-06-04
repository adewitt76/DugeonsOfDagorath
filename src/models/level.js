// @ts-check
import { Cell, DIRECTION, WALL_TYPE } from "../models/cell";
import { Random } from "../services/random";

export const MAP_SIZE = 32;

export class Level {

  /** @protected @type { Cell[][] } */
  _cells;

  /**
   * Create a new Level
   */
  constructor() {
    this.generate();
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

  /** Generate a new level.
    * @private
    */
  generate() {
    // Initialize random number generator with level-specific seed
    Random.instance.seed = Date.now();

    /** @type { Cell[][] } */
    this._cells = [];

    /** the row of the cell that is currently being considered.
      * @type { number } */
    let destination_row = 0;

    /** The column of the cell that is currently being considered.
      * @type { number } */
    let destination_column = 0;

    // *********************** Initialze Maze *******************
    for (let r = 0; r < MAP_SIZE; r++) {
      this.cells[r] = [];
      for (let c = 0; c < MAP_SIZE; c++) {
        this.cells[r][c] = new Cell();
      }
    }

    // ***************** Phase I: Create Maze *******************

    /** @type {{row: number, col: number, cell: Cell }} */
    const start = this._random_cell();
    destination_row = start.row;
    destination_column = start.col

    /** @type { number } */
    let remainingCells = 500;

    while (remainingCells > 0) {
      // Select random direction and distance
      /** @type { number } */
      let random_direction = Random.instance.number % 4;
      /** @type { number } */
      let random_distance = (Random.instance.number % 8) + 1;

      while (random_distance > 0) {

        // Take a tentative step
        const next = this.step(destination_row, destination_column, random_direction);
        if (!this.within_boundries(next.row, next.col)) {
          break;
        }

        // Check if we've been here before
        if (!this.cells[next.row][next.col].is_solid) {
          destination_row = next.row;
          destination_column = next.col;
          random_distance--;
          if (random_distance === 0) {
            break;
          }
          continue;
        }

        // Check for "cleared" corner patterns
        const neighbors = this.get_neighbors(destination_row, destination_column);

        // if there are none empty cells surrounding a corner
        // we don't want to place
        if (
          // Check upper-left corner
          (neighbors[3] && neighbors[0] && neighbors[1]) ||
          // Check upper-right corner
          (neighbors[1] && neighbors[2] && neighbors[5]) ||
          // Check lower-right corner
          (neighbors[5] && neighbors[8] && neighbors[7]) ||
          // Check lower-left corner
          (neighbors[7] && neighbors[6] && neighbors[3])
        ) {
          break;
        }

        // Mark cell as visited
        if (this.cells[destination_row][destination_column].is_solid) {
          this.cells[destination_row][destination_column].is_solid = false;
          remainingCells--;
        }
        destination_row = next.row;
        destination_column = next.col;
        random_distance--;
      }
    }

    // Phase II: Create Walls
    for (let r = 0; r < MAP_SIZE; r++) {
      for (let c = 0; c < MAP_SIZE; c++) {

        let cell = this.cells[r][c];
        if (cell.is_solid) {
          continue;
        }

        // Find neighbors
        const neighbors = this.get_neighbors(r, c);

        // Create walls based on neighbors
        if (neighbors[1]) {
          cell.walls[DIRECTION.north] = WALL_TYPE.open;
          cell.cells[DIRECTION.north] = this.cells[r - 1][c];
        } else {
          cell.walls[DIRECTION.north] = WALL_TYPE.solid;
        }
        if (neighbors[7]) {
          cell.walls[DIRECTION.south] = WALL_TYPE.open;
          cell.cells[DIRECTION.south] = this.cells[r + 1][c];
        } else {
          cell.walls[DIRECTION.south] = WALL_TYPE.solid;
        }
        if (neighbors[5]) {
          cell.walls[DIRECTION.east] = WALL_TYPE.open;
          cell.cells[DIRECTION.east] = this.cells[r][c + 1];
        } else {
          cell.walls[DIRECTION.east] = WALL_TYPE.solid;
        }
        if (neighbors[3]) {
          cell.walls[DIRECTION.west] = WALL_TYPE.open;
          cell.cells[DIRECTION.west] = this.cells[r][c - 1];
        } else {
          cell.walls[DIRECTION.west] = WALL_TYPE.solid;
        }
      }
    }

    // Create regular
    for (let i = 0; i < 70; i++) {
      this.make_door(WALL_TYPE.normal_door);
    }

    // Create regular
    for (let i = 0; i < 45; i++) {
      this.make_door(WALL_TYPE.magic_door);
    }
  }

  /** Check if position is within bounds
    * @param { number } row 
    * @param { number } col 
    * @return { boolean } is within boundries 
    * @private
    */
  within_boundries(row, col) {
    return (
      row >= 0 &&
      row < MAP_SIZE &&
      col >= 0 && col < MAP_SIZE
    );
  }

  /** Find open cell
    * @returns {{ row: number, col: number, cell: Cell }}
    */
  getRandomOpenCell() {
    /** @type {{ row: number, col: number, cell: Cell }} */
    let data;
    do {
      data = this._random_cell();
    }
    while (data.cell.is_solid);
    return data;
  }

  /** 
    * Pick a random cell in the dungeon
    * @returns {{ row: number, col: number, cell: Cell }}
    * @private 
    */
  _random_cell() {
    const row = Random.instance.number % MAP_SIZE;
    const col = Random.instance.number % MAP_SIZE;
    const cell = this._cells[row][col];
    return { row, col, cell };
  }

  /** Take a step in the specified direction
    * @param { number } row 
    * @param { number } col 
    * @param { number } dir 
    * @private
    */
  step(row, col, dir) {
    /** @type { number [][] }  [direction: 0 = North, 1 = S, 2 = E, 3 = W][vector of the step]*/
    const direction_vectors = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    return {
      row: row + direction_vectors[dir][0],
      col: col + direction_vectors[dir][1]
    };
  }

  /** Copy 3x3 neighborhood of cells around position (row,col)
    * @param { number } row 
    * @param { number } col 
    * @return { boolean[] } true means there is a neighbor cell
    * @private
    */
  get_neighbors(row, col) {
    const storage = new Array(9);
    let index = 0;

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (!this.within_boundries(r, c) || this._cells[r][c].is_solid) storage[index++] = false;
        else storage[index++] = true;
      }
    }
    return storage;
  }

  /**
    * @param { WALL_TYPE } door_type
    * @private
    */
  make_door(door_type) {
    while (true) {
      const cell_description = this._random_cell();
      if (cell_description.cell.is_solid) {
        continue;
      }

      const direction = Random.instance.number % 4;

      if (cell_description.cell.walls[direction] !== WALL_TYPE.open) {
        continue;
      }

      if (direction === DIRECTION.north) {
        cell_description.cell.walls[DIRECTION.north] = door_type;
        cell_description.cell.cells[DIRECTION.north].walls[DIRECTION.south] = door_type;
      }

      if (direction === DIRECTION.south) {
        cell_description.cell.walls[DIRECTION.south] = door_type;
        cell_description.cell.cells[DIRECTION.south].walls[DIRECTION.north] = door_type;
      }

      if (direction === DIRECTION.east) {
        cell_description.cell.walls[DIRECTION.east] = door_type;
        cell_description.cell.cells[DIRECTION.east].walls[DIRECTION.west] = door_type;
      }

      if (direction === DIRECTION.west) {
        cell_description.cell.walls[DIRECTION.west] = door_type;
        cell_description.cell.cells[DIRECTION.west].walls[DIRECTION.east] = door_type;
      }

      break;
    }
  }
}
