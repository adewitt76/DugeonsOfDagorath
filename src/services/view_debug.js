// @ts-check
import { Player } from "../models/player";

//
export class DebugOverlay {

  /** @private @type { HTMLDivElement } */
  _overlay;

  /** @private @type { DebugOverlay } */
  static _instance;

  /** @private @type { boolean } */
  _show;

  /** @private @type { number[] } */
  _times;

  /** @private */
  constructor() {
    this._show = false;
    this._overlay = /** @type { HTMLDivElement } */(document.getElementById('debug-overlay'));
    this._times = [];
  }

  /**
   * Get the instance of the stage
   * @returns { DebugOverlay }
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new DebugOverlay();
    return this._instance;
  }

  show() {
    this._overlay.style.display = 'block';
    this._show = true;
  }

  hide() {
    this._overlay.style.display = 'none';
    this._show = false;
  }

  paint() {
    let time_stamp = performance.now();
    while (this._times.length > 0 && this._times[0] <= time_stamp - 1000) {
      this._times.shift();
    }
    this._times.push(time_stamp);
    const fps = this._times.length;

    if (this._show) {
      this._overlay.innerHTML = `
        <p>
        FPS: ${fps}<br/>
        Player stats:<br/>
        &nbsp;&nbsp;power: ${Player.instance.power}<br/>
        &nbsp;&nbsp;damage: ${Player.instance.damage}<br/>
        &nbsp;&nbsp;total weight: ${Player.instance.total_weight}<br/>
        Torch:<br/>
        &nbsp;&nbsp;light level: ${Player.instance.light_level}<br/>
        &nbsp;&nbsp;time left: ${Player.instance.lit_torch?.time_remaining}<br/>
        </p>
      `
    }
  }
}
