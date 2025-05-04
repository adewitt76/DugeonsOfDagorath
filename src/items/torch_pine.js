
// @ts-check
import { Torch } from './torch.js';

export class PineTorch extends Torch {

  /** Create a new Torch
    * @param { boolean } revealed
    */
  constructor(revealed) {
    super('pine', revealed);
  }
}
