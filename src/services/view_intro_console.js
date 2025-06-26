// @ts-check
import { print_character } from "../models/font";
import { Painter } from "./painter";

export class IntroConsole {

  /** @private @type { IntroConsole } */
  static _instance;

  /** @private @type { Painter } */
  _painter;

  /** @private @type { boolean } */
  _colors_inverted;

  /** @private */
  constructor() {
    this._painter = new Painter();
    this._colors_inverted = false;
  }

  /** 
   * Gets the singleton instance of the console.
   * @return { IntroConsole } 
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new IntroConsole();
    return this._instance;
  }

  /**
   * Invert the colors for white display.
   * @param { boolean } invert
   */
  set invert(invert) {
    this._colors_inverted = invert;
  }

  /**
   * Paint the status bar.
   * @return { void }
   */
  paint() {
    const background_color = this._colors_inverted ? 'white' : 'black';
    this._painter.color = background_color;
    this._painter.distance = 1;
    this._painter.lightLevel = 13;
    // clear text area 158 to 192 on y
    for (let i = 160; i <= 192; i++) {
      this._painter.moveTo(0, i);
      this._painter.lineToRelative(255, 0);
    }
    // draw characters in buffers
    const line_location = [169, 177];
    ['I dare ye enter...', '...The Dungeons of Daggorath!!!'].forEach((buffer, index) => {
      let line_y = line_location[index];
      buffer.split('').forEach((c, i) => print_character(c, (i * 8) + 8, line_y, this._colors_inverted));
    });
  }
}
