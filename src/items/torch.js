// @ts-check
import { CellView } from "../services/view_cell";
import { Item } from "./item";

export class Torch extends Item {

  /** Create a new Torch
    * @param { string } subclass
    * @param { boolean } revealed
    */
  constructor(subclass, revealed) {
    super('torch', subclass, revealed);
  }

  /** use this item 
    * @param { 'left' | 'right' } hand
    */
  use(hand) {
    CellView.instance.light_level = [1, 2, 4, 8, 0, 0, 0, 0, 0];
  }
}

//const lunar_torch_full = [1, 1, 1, 1, 2, 8, 0, 0, 0];
//const solar_torch_full = [1, 1, 1, 1, 1, 1, 1, 2, 4];
