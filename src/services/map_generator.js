// @ts-check
import { Cell, DIRECTION, WALL_TYPE } from "../models/cell";
import { Random } from "./random";

// Constants
export const MAP_SIZE = 32;
// const HF_DOR = 0b01;  // Regular door pattern
// const HF_SDR = 0b10;  // Secret door pattern

export class DungeonGenerator {

  // Door pattern tables
  // dorTab = [HF_DOR, HF_DOR * 4, HF_DOR * 16, HF_DOR * 64];      // Regular doors
  // sdrTab = [HF_SDR, HF_SDR * 4, HF_SDR * 16, HF_SDR * 64];      // Secret doors

  /** Generate a new level.
    * @param { number } seed random number generator seed
    */
  generate(seed) {
    // Initialize random number generator with level-specific seed
    Random.instance.seed = seed;

    /** @type { Cell[][] } */
    let maze = [];

    /** the row of the cell that is currently being considered.
      * @type { number } */
    let destination_row = 0;

    /** The column of the cell that is currently being considered.
      * @type { number } */
    let destination_column = 0;

    /** The row of the next cell for consideration.
      * @type { number } */
    // let next_row = 0;

    /** The column of the next cell for consideration.
      * @private @type { number } */
    // let next_column = 0;


    // *********************** Initialze Maze *******************
    for (let r = 0; r < MAP_SIZE; r++) {
      maze[r] = [];
      for (let c = 0; c < MAP_SIZE; c++) {
        maze[r][c] = new Cell();
      }
    }

    // ***************** Phase I: Create Maze *******************

    /** @type {{row: number, col: number, cell: Cell }} */
    const start = this._random_cell(maze);
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

      /** @type { boolean } */
      let continueOuterLoop = false;

      while (random_distance > 0) {
        // Take a tentative step

        const next = this.step(destination_row, destination_column, random_direction);
        if (!this.within_boundries(next.row, next.col)) {
          break;
        }

        // Check if we've been here before
        if (!maze[next.row][next.col].is_solid) {
          destination_row = next.row;
          destination_column = next.col;
          random_distance--;
          if (random_distance === 0) {
            break;
          }
          continue;
        }

        // Check for "cleared" corner patterns
        const neighbors = this.get_neighbors(maze, destination_row, destination_column);

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
        if (maze[destination_row][destination_column].is_solid) {
          maze[destination_row][destination_column].is_solid = false;
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

        let cell = maze[r][c];
        if (cell.is_solid) {
          continue;
        }

        // Find neighbors
        const neighbors = this.get_neighbors(maze, r, c);

        // Create walls based on neighbors
        if (neighbors[1]) {
          cell.walls[DIRECTION.north] = WALL_TYPE.open;
          cell.cells[DIRECTION.north] = maze[r - 1][c];
        } else {
          cell.walls[DIRECTION.north] = WALL_TYPE.solid;
        }
        if (neighbors[7]) {
          cell.walls[DIRECTION.south] = WALL_TYPE.open;
          cell.cells[DIRECTION.south] = maze[r + 1][c];
        } else {
          cell.walls[DIRECTION.south] = WALL_TYPE.solid;
        }
        if (neighbors[5]) {
          cell.walls[DIRECTION.east] = WALL_TYPE.open;
          cell.cells[DIRECTION.east] = maze[r][c + 1];
        } else {
          cell.walls[DIRECTION.east] = WALL_TYPE.solid;
        }
        if (neighbors[3]) {
          cell.walls[DIRECTION.west] = WALL_TYPE.open;
          cell.cells[DIRECTION.west] = maze[r][c - 1];
        } else {
          cell.walls[DIRECTION.west] = WALL_TYPE.solid;
        }
      }
    }

    // Create regular
    for (let i = 0; i < 70; i++) {
      this.make_door(maze, WALL_TYPE.normal_door);
    }

    // Create regular
    for (let i = 0; i < 45; i++) {
      this.make_door(maze, WALL_TYPE.magic_door);
    }

    // // Spin the random number generator
    // const spinCount = Date.now() % 256;
    // for (let i = 0; i < spinCount; i++) {
    //   this.random();
    // }
    //
    return maze;
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

  /** 
   * Pick a random cell in the dungeon
   * @param { Cell[][] } maze
   * @returns {{ row: number, col: number, cell: Cell }}
   * @private 
   * */
  _random_cell(maze) {
    const row = Random.instance.number % MAP_SIZE;
    const col = Random.instance.number % MAP_SIZE;
    const cell = maze[row][col];
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
    * @param { Cell[][] } maze 
    * @param { number } row 
    * @param { number } col 
    * @return { boolean[] } true means there is a neighbor cell
    * @private
    */
  get_neighbors(maze, row, col) {
    const storage = new Array(9);
    let index = 0;

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (!this.within_boundries(r, c) || maze[r][c].is_solid) storage[index++] = false;
        else storage[index++] = true;
      }
    }
    return storage;
  }

  /**
  * @param { WALL_TYPE } door_type
  */
  make_door(maze, door_type) {
    while (true) {
      const cell_description = this._random_cell(maze);
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
  // Function to create doors
  // makdor(doorTable) {
  //   while (true) {
  //     // Find a random cell
  //     const { row, col, addr } = this._random_cell();
  //     let cell = this.maze[addr];
  //
  //     if (cell === 0xFF) {  // Skip solid cells
  //       continue;
  //     }
  //
  //     // Pick a random direction
  //     const dir = this.random() % 4;
  //
  //     // Check if we can put a door here
  //     if ((cell & this.mskTab[dir]) !== 0) {
  //       continue;
  //     }
  //
  //     // Place door in cell
  //     cell |= doorTable[dir];
  //     this.maze[addr] = cell;
  //
  //     // Move to adjoining cell and update it too
  //     const next = this.step(row, col, dir);
  //     if (!this.is_inbounds(next.row, next.col)) {
  //       continue;
  //     }
  //
  //     const oppDir = (dir + 2) % 4;  // Opposite direction
  //     const adjAddr = this.map32(next.row, next.col);
  //     let adjCell = this.maze[adjAddr];
  //     adjCell |= doorTable[oppDir];
  //     this.maze[adjAddr] = adjCell;
  //     break;
  //   }
  // }

}

