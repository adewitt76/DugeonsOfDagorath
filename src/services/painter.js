// @ts-check
import { Point } from '../models/point';
import { Stage } from './stage';

/*
| Light Level | Cell 0 | Cell 1 | Cell 2 | Cell 3 | Cell 4 | Cell 5 | Cell 6 | Cell 7 | Cell 8 |
|-------------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| 0 (Darkest) | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      |
| 1           | 4      | 8      | 0      | 0      | 0      | 0      | 0      | 0      | 0      |
| 2           | 3      | 4      | 8      | 0      | 0      | 0      | 0      | 0      | 0      |
| 3           | 3      | 4      | 8      | 0      | 0      | 0      | 0      | 0      | 0      |
| 4           | 2      | 3      | 4      | 8      | 0      | 0      | 0      | 0      | 0      |
| 5           | 2      | 3      | 4      | 8      | 0      | 0      | 0      | 0      | 0      |
| 5           | 2      | 3      | 4      | 8      | 0      | 0      | 0      | 0      | 0      |
| 7           | 1      | 2      | 3      | 4      | 8      | 0      | 0      | 0      | 0      |
| 8           | 1      | 1      | 2      | 3      | 4      | 5      | 8      | 0      | 0      |
| 9           | 1      | 1      | 2      | 2      | 3      | 4      | 5      | 8      | 0      |
| 10          | 1      | 1      | 1      | 2      | 2      | 3      | 4      | 5      | 6      |
| 11          | 1      | 1      | 1      | 2      | 2      | 3      | 3      | 4      | 5      |
| 12          | 1      | 1      | 1      | 1      | 2      | 2      | 3      | 3      | 4      |
| 13 (Brightest) | 1   | 1      | 1      | 1      | 2      | 2      | 2      | 3      | 3      |
Each value represents the dot frequency (1=solid, higher numbers=more sparse dots, 0=invisible).
 */

const LIGHT_LEVEL_TABLE = Object.freeze({
  0: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  1: [4, 8, 0, 0, 0, 0, 0, 0, 0],
  2: [3, 4, 8, 0, 0, 0, 0, 0, 0],
  3: [3, 4, 8, 0, 0, 0, 0, 0, 0],
  4: [2, 3, 4, 8, 0, 0, 0, 0, 0],
  5: [2, 3, 4, 8, 0, 0, 0, 0, 0],
  6: [2, 3, 4, 8, 0, 0, 0, 0, 0],
  7: [1, 2, 3, 4, 8, 0, 0, 0, 0],
  8: [1, 1, 2, 3, 4, 5, 8, 0, 0],
  9: [1, 1, 2, 2, 3, 4, 5, 8, 0],
  10: [1, 1, 1, 2, 2, 3, 4, 5, 6],
  11: [1, 1, 1, 2, 2, 3, 3, 4, 5],
  12: [1, 1, 1, 1, 2, 2, 3, 3, 4],
  13: [1, 1, 1, 1, 2, 2, 2, 3, 3],
});

const SCALING_TABLE = {
  0: [408, -76, -45],
  1: [256, 0, 0],
  2: [159, 49, 30],
  3: [99, 79, 48],
  4: [61, 98, 59],
  5: [35, 111, 67],
  6: [21, 118, 71],
  7: [11, 123, 75],
  8: [7, 125, 76],
}

export class Painter {
  /** @private @type { Point } */
  _current;
  /** @private @type { string } */
  _color;
  /** @private @type { Stage } */
  _stage;
  /** @private @type { number } */
  _distance = 1;
  /** @private @type { number } */
  _lightLevel = 0;

  constructor() {
    this._stage = Stage.instance;
  }

  /** @param {string} color */
  set color(color) {
    this._color = color;
  }

  /** @param { number } distance */
  set distance(distance) {
    this._distance = distance;
  }

  /** @param { number } level */
  set lightLevel(level) {
    this._lightLevel = level;
  }

  /** 
   * Set the coordinates to begin drawing 
   * @param { number } x coordinate
   * @param { number } y coordinate
   */
  moveTo(x, y) {
    this._current = new Point(x, y);
  }

  /**
   * Draw a line from current location to x, y where
   * x and y are relative to the set coordinates.
   * @param { number } x coordinate
   * @param { number } y coordinate
   */
  lineToRelative(x, y) {
    const old_current = this._current;
    const new_current = new Point(this._current.x + x, this._current.y + y);
    this.drawLine(old_current.x, old_current.y, new_current.x, new_current.y);
    this._current = new_current;
  }

  /**
   * Draw a line from current location to x, y where
   * x and y are the exact coordinates to draw to.
   * @param { number } x coordinate
   * @param { number } y coordinate
   */
  lineTo(x, y) {
    this.drawLine(this._current.x, this._current.y, x, y);
    this._current = new Point(x, y);
  }

  /**
   * Draws a single pixel and the given coordinate
   * @param { number } x coordinate
   * @param { number } y coordinate
   */
  drawPixel(x, y) {
    this.draw_pixel(x, y);
  }

  /** 
   * @private 
   */
  draw_pixel(x, y) {
    this._stage.canvas.fillStyle = this._color;
    this._stage.canvas.fillRect(x, y, 1, 1);
  }

  /** 
   * @private 
   */
  drawLine(x1, y1, x2, y2) {
    const dot_frequency = LIGHT_LEVEL_TABLE[this._lightLevel][this._distance];
    if (dot_frequency === 0) return;
    x1 = this.scaleX(x1);
    y1 = this.scaleY(y1);
    x2 = this.scaleX(x2);
    y2 = this.scaleY(y2);

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const step_x = x1 < x2 ? 1 : -1;
    const step_y = y1 < y2 ? 1 : -1;

    let dot_counter = 0;

    if (dx > dy) { // x-driven line
      let err = dx / 2;
      while (x1 !== x2) {
        if ((dot_counter % dot_frequency) === 0) {
          this.draw_pixel(x1, y1);
        }
        dot_counter++;
        err -= dy;
        if (err < 0) {
          y1 += step_y;
          err += dx;
        }
        x1 += step_x;
      }
    } else { // y-driven line
      let err = dy / 2;
      while (y1 !== y2) {
        if ((dot_counter % dot_frequency) === 0) {
          this.draw_pixel(x1, y1);
        }
        dot_counter++;
        err -= dx;
        if (err < 0) {
          x1 += step_x;
          err += dy;
        }
        y1 += step_y;
      }
    }
    if ((dot_counter % dot_frequency) === 0) {
      this.draw_pixel(x2, y2);
    }
  }

  /**
    * Finds the new x based on the scaling table
    * @param { number } x the distance from the player
    * @return { number } the calculated coordinates based on distance
    * @private
    */
  scaleX(x) {
    if (this._distance < 0 || 8 < this._distance) {
      return x;
    }
    return Math.trunc(x * (SCALING_TABLE[this._distance][0] / 256)) + SCALING_TABLE[this._distance][1];
  }

  /**
    * Finds the new y based on the scaling table
    * @param { number } y the distance from the player
    * @return { number } the calculated coordinates based on distance
    * @private
    */
  scaleY(y) {
    if (this._distance < 0 || 8 < this._distance) {
      return y;
    }
    return Math.trunc(y * (SCALING_TABLE[this._distance][0] / 256) + SCALING_TABLE[this._distance][2]);
  }
}

