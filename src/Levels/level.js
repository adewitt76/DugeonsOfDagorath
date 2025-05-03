// @ts-check
import { Cell } from "../models/cell";
import { DungeonGenerator } from "../services/map_generator";

export class Level {

  /** @protected @type { Cell[][] } */
  _cells;

  /**
   * Create a new Level
   * @param { number } seed
   */
  constructor(seed) {
    const generator = new DungeonGenerator()
    this._cells = generator.generate(seed);
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
}
