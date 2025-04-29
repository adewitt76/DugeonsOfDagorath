// @ts-check
import { Cell, DIRECTION, WALL_TYPE } from "../models/cell";
import { Painter } from "./painter";

/**
 * @class
 * @singleton
 */
export class CellView {

  /** @private @type { CellView } */
  static _instance;

  /** @private @type { Painter } */
  _painter;

  /** @private */
  constructor() {
    this._painter = new Painter();
  }

  /**
   * Get the instance of the stage
   * @returns { CellView }
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new CellView();
    return this._instance;
  }

  /**
   * Paint the given cell
   * @param { Cell } cell 
   * @param { number } distance the distance in cells from view
   * @param { DIRECTION } direction the view direction
   */
  paint(cell, distance, direction) {
    let /** @type { WALL_TYPE } */ left;
    let /** @type { WALL_TYPE } */ right;
    let /** @type { WALL_TYPE } */ forward;
    let center;

    switch (direction) {
      case DIRECTION.north:
        forward = cell.walls[DIRECTION.north];
        right = cell.walls[DIRECTION.east];
        left = cell.walls[DIRECTION.west];
        break;
      case DIRECTION.south:
        forward = cell.walls[DIRECTION.south];
        right = cell.walls[DIRECTION.west];
        left = cell.walls[DIRECTION.east];
        break;
      case DIRECTION.east:
        forward = cell.walls[DIRECTION.east];
        right = cell.walls[DIRECTION.south];
        left = cell.walls[DIRECTION.north];
        break;
      default:
        forward = cell.walls[DIRECTION.west];
        right = cell.walls[DIRECTION.north];
        left = cell.walls[DIRECTION.south];
        break;
    }

    // 1. paint forward
    switch (forward) {
      case WALL_TYPE.open:
        this.paint(cell.cells[/** @type {number} */(direction)], distance + 1, direction);
        break;
      case WALL_TYPE.solid:
        this.drawSolidWall(distance);
        break;
      case WALL_TYPE.normal_door:
        break;
      case WALL_TYPE.magic_door:
        break;
    }

    // 2. paint right
    switch (right) {
      case WALL_TYPE.open:
        this.drawOpenWallRight(distance);
        break;
      case WALL_TYPE.solid:
        this.drawSolidWallRight(distance);
        break;
      case WALL_TYPE.normal_door:
        break;
      case WALL_TYPE.magic_door:
        break;
    }

    // 3. paint left
    switch (left) {
      case WALL_TYPE.open:
        this.drawOpenWallLeft(distance);
        break;
      case WALL_TYPE.solid:
        this.drawSolidWallLeft(distance);
        break;
      case WALL_TYPE.normal_door:
        break;
      case WALL_TYPE.magic_door:
        break;
    }

    // 4. paint center
    switch (center) {
      default:
        this.ceiling(distance);
    }
    // 5. paint inventory
    // 5. paint creature;
  }

  /**
   * Draw a single line ceiling
   * @param { number } distance the distance to determine light level
   * @private
   */
  ceiling(distance) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = 1;
    this._painter.moveTo(47, 28);
    this._painter.lineTo(210, 28);
  }

  /**
   * Draw a solid wall on the left
   * @param { number } distance the distance to determine light level
   * @private
   */
  drawSolidWall(distance) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = 1;
    this._painter.moveTo(64, 38);
    this._painter.lineTo(192, 38);
    this._painter.moveTo(64, 114);
    this._painter.lineTo(192, 114);
  }

  /**
   * Draw a solid wall on the left
   * @param { number } distance the distance to determine light level
   * @private
   */
  drawSolidWallLeft(distance) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = 1;
    this._painter.moveTo(27, 16);
    this._painter.lineTo(64, 38);
    this._painter.lineTo(64, 114);
    this._painter.lineTo(27, 136);
  }

  /**
   * Draw a solid wall on the right
   * @param { number } distance the distance to determine light level
   * @private
   */
  drawSolidWallRight(distance) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = 1;
    this._painter.moveTo(229, 16);
    this._painter.lineTo(192, 38);
    this._painter.lineTo(192, 114);
    this._painter.lineTo(229, 136);
  }

  /**
   * Draw a open wall on the left
   * @param { number } distance the distance to determine light level
   * @private
   */
  drawOpenWallLeft(distance) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = 1;
    this._painter.moveTo(29, 38);
    this._painter.lineTo(64, 38);
    this._painter.lineTo(64, 114);
    this._painter.lineTo(27, 114);
    this._painter.moveTo(27, 16);
    this._painter.lineTo(64, 38);
  }

  /**
   * Draw a open wall on the right
   * @param { number } distance the distance to determine light level
   * @private
   */
  drawOpenWallRight(distance) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = 1;
    this._painter.moveTo(229, 38);
    this._painter.lineTo(192, 38);
    this._painter.lineTo(192, 114);
    this._painter.lineTo(229, 114);
    this._painter.moveTo(229, 16);
    this._painter.lineTo(192, 38);
  }
}
