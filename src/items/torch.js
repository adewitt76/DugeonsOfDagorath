// @ts-check
import { Painter } from "../services/painter";
import { SoundGenerator } from "../services/sound_manager";
import { Item, ITEM_CLASS } from "./item";


/** @abstract */
export class Torch extends Item {

  /** @private @type { HTMLAudioElement } */

  /** @private @type { boolean } */
  _lit = false;

  /** @private @type { number } */
  _time_remaining = 15;

  /** @private @type { boolean } */
  _dead = false;

  /** @private @type { number }*/
  _animation_frame;

  /** @private @type { number } */
  _light_level;

  /** @private @type { number } */
  _magic_illumination;

  /** @private @type { number } */
  _start_time;

  /** Create a new Torch
    * @param { string } subclass
    * @param { number } reveal_power
    * @param { number } light_level 
    * @param { number } time_remaining 
    * @param { number } magic_illumination
    * @param { boolean } revealed
    */
  constructor(subclass, reveal_power, revealed, light_level, magic_illumination, time_remaining) {
    super(ITEM_CLASS.torch, subclass, 10, reveal_power, revealed);
    this._light_level = light_level;
    this._magic_illumination = magic_illumination;
    this._time_remaining = time_remaining;
  }

  /** use this item */
  async use() {
    if (!this._dead) {
      SoundGenerator.instance.torch(1);
      this._lit = true
      this._animation_frame = requestAnimationFrame(this.light);
    }
  }

  /** Item has been stowed */
  putOut() {
    if (this._animation_frame) {
      this._lit = false;
      cancelAnimationFrame(this._animation_frame);
      this._start_time = 0;
      this._animation_frame = 0;
    }
  }

  /** @return { boolean } */
  get isLit() {
    return this._lit;
  }

  /** @return { number } */
  get light_level() {
    if (!this._revealed && this._light_level > 7) {
      return 7;
    }
    return this._light_level;
  }

  /** @return { number } */
  get magic_illumination() {
    return this._magic_illumination;
  }

  /** return { number } */
  get time_remaining() {
    return this._time_remaining - 1;
  }

  /**
   * @param { Painter } painter
   */
  paint(painter) {
    painter.moveTo(60, 118);
    painter.lineToRelative(14, -2);
    painter.lineToRelative(-2, -2);
    painter.lineToRelative(-12, 4);
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
    this._light_level = this._time_remaining > this._light_level ?
      this._light_level : this._time_remaining;
      
    this._magic_illumination = this._time_remaining > this._magic_illumination ?
      this._magic_illumination : this._time_remaining;

    if (this._time_remaining <= 0) {
      this._lit = false;
      this._dead = true;
      this._start_time = 0;
      this._time_remaining = 0;
    }
  }

  /** This function runs while the torch is lit
   * @param { number } time_stamp
   * @private
   */
  light = (time_stamp) => {
    if (!this._start_time) this._start_time = time_stamp;
    const elapsed_time = (time_stamp - this._start_time) / 1000;
    if (elapsed_time >= 60) {
      this._start_time = time_stamp;
      this._time_remaining--;
      this.update();
    }
    if (this._lit) {
      this._animation_frame = requestAnimationFrame(this.light);
    }
  }
}

