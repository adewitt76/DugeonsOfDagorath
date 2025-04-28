// @ts-check

import { print_character } from "../models/font";
import { Painter } from "./painter";

export class Console {

  /** @private @type { Console } */
  static _instance;

  /** @private @type { Painter } */
  _painter;

  /** @private @type { boolean } */
  _colors_inverted;

  /** @private @type { string[][] } */
  _input_buffers;

  /** @private @type { number } */
  _buffer_pointer;

  /** @private */
  constructor() {
    this._painter = new Painter();
    this._colors_inverted = false;
    this._input_buffers = [];
    this._input_buffers.push([]);
    this._buffer_pointer = 0;
    document.addEventListener('keydown', this.process_keyboard_events)
  }

  /** 
   * Gets the singleton instance of the console.
   * @return { Console } 
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new Console();
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
   * Process keydown events
   * @param { KeyboardEvent } event
   * @private
   */
  process_keyboard_events = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (/[A-Za-z\s]{1}/.test(event.key) && event.key.length === 1) {
      if (this._input_buffers[this._buffer_pointer].length < 35) {
        this._input_buffers[this._buffer_pointer].push(event.key);
      }
    }

    if (event.key === 'Backspace') this._input_buffers[this._buffer_pointer].pop();

    if (event.key === 'Enter') {
      const command = this._input_buffers[this._buffer_pointer].join('');
      if (this._buffer_pointer === 3) {
        this._input_buffers.shift();
      } else {
        this._buffer_pointer++;
      }
      this._input_buffers.push([]);

      console.log('command', command);
    }
  }

  /**
   * Paint the status bar.
   * @return { void }
   */
  paint() {
    const background_color = this._colors_inverted ? 'white' : 'black';
    const foreground_color = this._colors_inverted ? 'black' : 'white';
    this._painter.color = background_color;
    this._painter.distance = 1;
    this._painter.lightLevel = 1;
    // clear text area 158 to 192 on y
    for (let i = 160; i <= 192; i++) {
      this._painter.moveTo(0, i);
      this._painter.lineToRelative(255, 0);
    }

    // draw characters in buffers
    const line_location = [161, 169, 177, 185];
    this._input_buffers.forEach((buffer, index) => {
      index = this._input_buffers.length < 4 ? index + 1 : index;
      let line_y = line_location[index];
      print_character('_', 0, line_y, this._colors_inverted);
      buffer.forEach((c, i) => print_character(c, (i * 7) + 7, line_y, this._colors_inverted));
    });
  }
}
