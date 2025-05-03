// @ts-check
import { Painter } from "./painter";
import { print_character } from "../models/font";

export class StatusBar {

  /** @private @type { StatusBar } */
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
   * Gets the singleton instance of the staus bar.
   * @return { StatusBar } 
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new StatusBar();
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
    const background_color = this._colors_inverted ? 'black' : 'white';
    const foreground_color = this._colors_inverted ? 'white' : 'black';
    this._painter.color = background_color;
    this._painter.distance = 1;
    this._painter.lightLevel = 1;
    // first paint the bar
    for (let i = 151; i <= 159; i++) {
      this._painter.moveTo(0, i);
      this._painter.lineToRelative(255, 0);
    }
    /* TODO: print left hand */
    print_character('e', 0, 152, !this._colors_inverted);
    print_character('m', 7, 152, !this._colors_inverted);
    print_character('p', 14, 152, !this._colors_inverted);
    print_character('t', 21, 152, !this._colors_inverted);
    print_character('y', 28, 152, !this._colors_inverted);

    /* TODO: print heart */

    /* TODO: print right hand */
    print_character('e', 221, 152, !this._colors_inverted);
    print_character('m', 228, 152, !this._colors_inverted);
    print_character('p', 235, 152, !this._colors_inverted);
    print_character('t', 242, 152, !this._colors_inverted);
    print_character('y', 249, 152, !this._colors_inverted);
  }
}

