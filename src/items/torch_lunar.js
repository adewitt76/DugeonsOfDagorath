
// @ts-check
import { Torch } from './torch.js';

export class LunarTorch extends Torch {

  /** Create a new lunar torch this torch
   * has all the same properties of the base class
   * @param { boolean } revealed
   */
  constructor(revealed) {
    super('lunar', 625, revealed, 10, 4, 30);
  }
}
