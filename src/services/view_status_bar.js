// @ts-check
import { Painter } from "./painter";
import { FONT, print_character, print_font_char } from "../models/font";
import { Player } from "../models/player";
import { SoundGenerator } from "./sound_manager";

export class StatusBar {

  /** @private @type { StatusBar } */
  static _instance;

  /** @private @type { Painter } */
  _painter;

  /** @private @type { boolean } */
  _colors_inverted;

  /** @private @type { boolean } */
  _show_large_heart;

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

  beat_heart() {
    this._show_large_heart = !this._show_large_heart;

    SoundGenerator.instance.heart_1();
    setTimeout(() => {
      this._show_large_heart = !this._show_large_heart;
      SoundGenerator.instance.heart_2();
    }, 120);
  }

  /**
   * Paint the status bar.
   * @return { void }
   */
  paint() {
    const background_color = this._colors_inverted ? 'black' : 'white';
    this._painter.color = background_color;
    this._painter.distance = 1;
    this._painter.lightLevel = 13;

    // first paint the bar
    for (let i = 151; i <= 159; i++) {
      this._painter.moveTo(0, i);
      this._painter.lineToRelative(255, 0);
    }

    this.print_left_text(Player.instance.left_hand_item_text);
    this.print_heart();
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

  print_heart() {
    if (this._show_large_heart) {
      print_font_char(FONT.hbl1, 15 * 8, 152, !this._colors_inverted);
      print_font_char(FONT.hbl2, (16 * 8) - 3, 152, !this._colors_inverted);
    } else {
      print_font_char(FONT.hbs1, 15 * 8, 152, !this._colors_inverted);
      print_font_char(FONT.hbs2, (16 * 8) - 3, 152, !this._colors_inverted);
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

