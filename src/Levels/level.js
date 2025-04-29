import { Cell } from "../models/cell";

/** @abstract */
export class Level {

  /**
    * Get an indvidual cell from the level map
    * @param { number } x
    * @param { number } y
    * @return { Cell }
    */
  getCell(x, y) {
    throw new Error('Not implemented');
  }

}
