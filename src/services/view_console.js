// @ts-check

import { print_character } from "../models/font";
import { CommandManager } from "./command_manager";
import { Painter } from "./painter";

export class Console {

  /** @private @type { Console } */
  static _instance;

  /** @private @type { Painter } */
  _painter;

  /** @private @type { boolean } */
  _colors_inverted;

  /** @private @type { string[] } */
  _history_buffer;

  /** @private @type { string[] } */
  _input_buffer;

  /** @private @type { CommandManager } */
  _command_manager;

  /** @private */
  constructor() {
    this._painter = new Painter();
    this._colors_inverted = false;
    this._input_buffer = [];
    this._history_buffer = [];
    this._buffer_pointer = 0;
    this._command_manager = CommandManager.instance;
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
    let history_index = 0;
    const line_location = [161, 169, 177, 185];
    this._history_buffer.forEach((buffer, index) => {
      history_index = this._history_buffer.length < 3 ? index + 1 : index;
      let line_y = line_location[history_index];
      print_character('_', 0, line_y, this._colors_inverted);
      buffer.split('').forEach((c, i) => print_character(c, (i * 8) + 8, line_y, this._colors_inverted));
    });
    history_index++;
    let line_y = line_location[history_index];
    print_character('_', 0, line_y, this._colors_inverted);
    this._input_buffer.forEach((c, i) => print_character(c, (i * 8) + 8, line_y, this._colors_inverted));
  }

  /**
   * Append a message to the end of the last command
   * @param { string } message
   */
  append(message) {
    this._history_buffer[this._history_buffer.length - 1] += " " + message;
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
      if (this._input_buffer.length < 35) {
        this._input_buffer.push(event.key);
      }
    }

    if (event.key === 'Backspace') this._input_buffer.pop();

    if (event.key === 'Enter') {
      const command = this._input_buffer.join('');
      this._history_buffer.push(command);
      if (this._history_buffer.length === 4) {
        this._history_buffer.shift();
      }
      this._input_buffer = [];
      this._command_manager.process(command);
    }
  }
}
