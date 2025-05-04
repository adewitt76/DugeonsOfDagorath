import { Item, ITEM_CLASS } from "./item";

/** @abstract */
export class Scroll extends Item {
  /** Create a base scroll  
  */
  constructor(subclass, reveal_power, revealed) {
    super(ITEM_CLASS.Scroll, subclass, 10, reveal_power, revealed);
  }
}
