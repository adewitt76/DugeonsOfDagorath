
// @ts-check
import { Torch } from './torch.js';

export class PineTorch extends Torch {

  /** Create a new pine torch this torch
   * has all the same properties of the base class
   * @param { boolean } revealed
   */
  constructor(revealed) {
    super('pine', 125, revealed);
  }
}
