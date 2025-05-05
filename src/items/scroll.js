import { Item, ITEM_CLASS } from "./item";

/** @abstract */
export class Scroll extends Item {

  /** Create a base scroll
   * @param { string } subclass 
   * @param { number } reveal_power 
   * @param { boolean } revealed
   */
  constructor(subclass, reveal_power, revealed) {
    super(ITEM_CLASS.scroll, subclass, 10, reveal_power, revealed);
  }
}
