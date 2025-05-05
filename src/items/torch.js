// @ts-check
import { CellView } from "../services/view_cell";
import { Item, ITEM_CLASS } from "./item";

/** @abstract */
export class Torch extends Item {

  /** @private @type { boolean } */
  _lit = false;

  /** @private @type { number } */
  _minutes_until_burnout = 15;

  /** @private @type { boolean } */
  _dead = false;

  /** @private @type { NodeJS.Timeout | undefined }*/
  _interval;

  /** @private @type { number } */
  _light_level;

  /** Create a new Torch
    * @param { string } subclass
    * @param { number } reveal_power
    * @param { number } light_level 
    * @param { number } minutes_until_burnout 
    * @param { boolean } revealed
    */
  constructor(subclass, reveal_power, revealed, light_level, minutes_until_burnout) {
    super(ITEM_CLASS.torch, subclass, 10, reveal_power, revealed);
    this._light_level = light_level;
    this._minutes_until_burnout;
  }

  /** use this item */
  use() {
    if (!this._dead) {
      this._lit = true;
      this._interval = setInterval(() => {
        this._minutes_until_burnout--;
        this.update();
      }, 60000);
    }
  }

  /** Item has been stowed */
  putOut() {
    if (this._interval) {
      this._lit = false;
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }

  /** @return { boolean } */
  get isLit() {
    return this._lit;
  }

  /** return { number } */
  get light_level() {
    if (!this._revealed && this._light_level > 7) {
      return 7;
    }
    return this._light_level;
  }

  /** @return { string } */
  toString() {
    if (this._dead) {
      return 'dead torch';
    }
    return super.toString();
  }

  /** Update the state of the torch 
   * @private
   */
  update() {
    this._light_level = this._minutes_until_burnout > this._light_level ?
      this._light_level : this._minutes_until_burnout;

    if (!this._minutes_until_burnout) {
      this._lit = false;
      this._dead = true;
      clearInterval(this._interval);
      this._interval = undefined;
      return;
    }
  }
}

