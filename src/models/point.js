// @ts-check
export class Point {

  /** @private @type { number } */
  _x;
  /** @private @type { number } */
  _y;

  /**
   * Create an immutable point for use with drawing
   * @param { number } x coordinate
   * @param { number } y coordinate
   */
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  /**
   * @return { number } the x coordinate of the point
   */
  get x() {
    return this._x;
  }

  /**
   * @return { number } the y coordinate of the point
   */
  get y() {
    return this._y;
  }
}

