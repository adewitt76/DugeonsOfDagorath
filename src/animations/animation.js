// @ts-check

/** @abstract */
export class Animation {

  /** @protected @type { boolean } */
  _complete;

  constructor() {
    this._complete = false;
  }

  /** @abstract 
    * @param { number } af_time_stamp Animation frames time stamp
    * @param { number } light_level The players light level
    */
  draw(af_time_stamp, light_level) { }

  /** Has the animation completed
    * @returns { boolean }
    */
  get completed() {
    return this._complete;
  }

}
