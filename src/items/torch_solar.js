
// @ts-check
import { Torch } from './torch.js';

export class SolarTorch extends Torch {

  /** Create a new pine torch this torch
   * has all the same properties of the base class
   * @param { boolean } revealed
   */
  constructor(revealed) {
    super('solar', 1750, revealed, 13, 60);
  }
}
