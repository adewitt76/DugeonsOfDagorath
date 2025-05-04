// @ts-check
import { Painter } from "./painter";
import { print_character } from "../models/font";
import { Player } from "../models/player";

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
    this._painter.color = background_color;
    this._painter.distance = 1;
    this._painter.lightLevel = 1;
    // first paint the bar
    for (let i = 151; i <= 159; i++) {
      this._painter.moveTo(0, i);
      this._painter.lineToRelative(255, 0);
    }

    this.print_left_text(Player.instance.left_hand_item_text);

    /* TODO: print heart */

    this.print_right_text(Player.instance.right_hand_item_text);
  }

  /** Prints text justified left on bar
    * @param { string } text @private 
    */
  print_left_text(text) {
    for (let i = 0; i < text.length; i++) {
      print_character(text[i], i * 8, 152, !this._colors_inverted);
    }
  }

  /** Prints text justified right on bar
    * @param { string } text
    * @private 
    */
  print_right_text(text) {
    let starting_character = 32 - text.length;
    for (let i = 0; i < text.length; i++) {
      print_character(text[i], starting_character++ * 8, 152, !this._colors_inverted);
    }
  }
}

