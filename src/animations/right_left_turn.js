// @ts-check
import { Painter } from "../services/painter";
import { Animation } from "./animation";

export class RightToLeftTurnAnimation extends Animation {

  /** @private @type { number } */
  _start_time;

  /** @private @type { Painter } */
  _painter;

  _animation_length = 250;

  constructor() {
    super();
    this._painter = new Painter();
    this._painter.color = 'white';
  }

  /** @param { number } af_time_stamp Animation frames time stamp
    * @param { number } light_level The players light level
    */
  draw(af_time_stamp, light_level) {
    this._painter.lightLevel = light_level;
    this._painter.color = 'white';
    this._painter.distance = 0;
    if (!this._start_time) this._start_time = af_time_stamp;
    if (af_time_stamp > (this._start_time + this._animation_length)) {
      this._complete = true;
      return;
    }
    const elapsed_time = af_time_stamp - this._start_time;
    const elapsed_percentage = elapsed_time / this._animation_length;
    const x = 255 - Math.trunc(255 * elapsed_percentage);
    this._painter.drawLine(x, 16, x, 136);
    this._painter.drawLine(0, 16, 255, 16);
    this._painter.drawLine(0, 136, 255, 136);
  }

}
