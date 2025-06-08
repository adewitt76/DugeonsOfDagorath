// @ts-check
import { Animation } from "../animations/animation";

export class AnimationManager {

  /** @private @type { AnimationManager }*/
  static _instance;

  /** @private @type { Animation[] } */
  _animation_play_list;

  /** @private */
  constructor() {
    this._animation_play_list = [];
  }

  /** @returns { AnimationManager } */
  static get instance() {
    if (!this._instance) {
      this._instance = new AnimationManager();
    }
    return this._instance;
  }

  /** @returns { boolean } */
  get has_animation() {
    return this._animation_play_list.length > 0;
  }

  /** Play queue'd animations 
    * @param { number } af_time_stamp Animation frames time stamp
    * @param { number } light_level The players light level
    */
  paint(af_time_stamp, light_level) {
    this._animation_play_list[0].draw(af_time_stamp, light_level);
    if (this._animation_play_list[0].completed) {
      this._animation_play_list.shift();
    }
  }

  /** Add an animation to the queue
    * @param { Animation } animation
    */
  add(animation) {
    this._animation_play_list.push(animation);
  }
}
