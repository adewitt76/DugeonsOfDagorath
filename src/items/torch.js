// @ts-check
import { CellView } from "../services/view_cell";
import { Item } from "./item";

export class Torch extends Item {

  /** @private @type { boolean } */
  _lit = false;

  /** @private @type { number } */
  _minutes_until_burnout = 15;

  /** @private @type { boolean } */
  _dead = false;

  /** @private @type { NodeJS.Timeout | undefined }*/
  _interval;

  /** Create a new Torch
    * @param { string } subclass
    * @param { boolean } revealed
    */
  constructor(subclass, revealed) {
    super('torch', subclass, revealed);
  }

  /** use this item */
  use() {
    if (!this._dead) {
      CellView.instance.light_level = [1, 2, 4, 8, 0, 0, 0, 0, 0];
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
    if (!this._minutes_until_burnout) {
      this._lit = false;
      this._dead = true;
      CellView.instance.light_level = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      clearInterval(this._interval);
      this._interval = undefined;
      return;
    }
    if (this._minutes_until_burnout < 1) {
      CellView.instance.light_level = [8, 0, 0, 0, 0, 0, 0, 0, 0];
      return;
    }
    if (this._minutes_until_burnout < 2) {
      CellView.instance.light_level = [4, 8, 0, 0, 0, 0, 0, 0, 0];
      return;
    }
    if (this._minutes_until_burnout < 3) {
      CellView.instance.light_level = [4, 6, 8, 0, 0, 0, 0, 0, 0];
      return;
    }
    if (this._minutes_until_burnout < 4) {
      CellView.instance.light_level = [3, 4, 8, 0, 0, 0, 0, 0, 0];
      return;
    }
    if (this._minutes_until_burnout < 5) {
      CellView.instance.light_level = [2, 4, 8, 0, 0, 0, 0, 0, 0];
      return;
    }
  }
}

//const lunar_torch_full = [1, 1, 1, 1, 2, 8, 0, 0, 0];
//const solar_torch_full = [1, 1, 1, 1, 1, 1, 1, 2, 4];
