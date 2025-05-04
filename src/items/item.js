// @ts-check
import { Player } from '../models/player.js';

export const ITEM_CLASS = Object.freeze({
  flask: 'flask',
  ring: 'ring',
  scroll: 'scroll',
  shield: 'shield',
  sword: 'sword',
  torch: 'torch'
});

/** @abstract */
export class Item {
  /** @priveate @type { number } */
  _weight;

  /** @private @type { number } */
  _needed_reveal_power;

  /** @private @type { 'flask' | 'ring' | 'scroll' | 'shield' | 'sword' | 'torch' } */
  _class_name;

  /** @private @type { string } */
  _subclass;

  /** @private @type { boolean } */
  _revealed;

  /** Create a new Item
   * @param { 'flask' | 'ring' | 'scroll' | 'shield' | 'sword' | 'torch' } class_name
   * @param { string } subclass
   * @param { number } weight 
   * @param { number } reveal_power 
   * @param { boolean } revealed
   */
  constructor(class_name, subclass, weight, reveal_power, revealed) {
    this._class_name = class_name;
    this._subclass = subclass;
    this._revealed = revealed;
    this._weight = weight;
    this._needed_reveal_power = reveal_power;
  }

  /** use this item */
  use() { }

  /** Item has been stowed */
  stow() { }

  /** @return { string } */
  get class_name() { return this._class_name; }

  /** @return { number } */
  get weight() { return this._weight; }

  /** Attempts to reveal the subclass 
   */
  reveal() {
    this._revealed = Player.instance.power >= this._needed_reveal_power;
  }

  /** @return { string } */
  toString() {
    return (this._revealed ? `${this._subclass} ` : '') + this._class_name;
  }
}
