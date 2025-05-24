// @ts-check
import { Player } from "../models/player";

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

  /** Show the debug-overlay */
  show() {
    this._overlay.style.display = 'block';
    this._show = true;
  }

  /** Hide the debug-overlay */
  hide() {
    this._overlay.style.display = 'none';
    this._show = false;
  }

  /** Paint on the screen if shown */
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
        </p>
      `;
      this._overlay.innerHTML += `
        <p>
        Player stats:<br/>
        &nbsp;&nbsp;Power: ${Player.instance.power}<br/>
        &nbsp;&nbsp;Damage: ${Player.instance.damage}<br/>
        &nbsp;&nbsp;Total Weight: ${Player.instance.total_weight}<br/>
        &nbsp;&nbsp;JIFFY Score: ${Player.instance.jiffy_score}<br/>
        &nbsp;&nbsp;Heart Rate: ${Player.instance.heart_rate}<br/>
        </p>
      `;
      if (Player.instance.lit_torch)
        this._overlay.innerHTML += `
        <p>
        Torch:<br/>
        &nbsp;&nbsp;light level: ${Player.instance.light_level}<br/>
        &nbsp;&nbsp;time left: ${Player.instance.lit_torch.time_remaining}<br/>
        </p>
      `
    }
  }

}
