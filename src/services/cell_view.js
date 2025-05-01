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

  /** @private @type { number[] } */
  _light_level = [1, 1, 1, 1, 2, 8, 0, 0, 0];

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
        if (distance > 7) return;
        this.paint(cell.cells[/** @type {number} */(direction)], distance + 1, direction);
        break;
      case WALL_TYPE.solid:
        this.drawSolidWall(distance);
        break;
      case WALL_TYPE.normal_door:
        this.drawDoorForward(distance)
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
        this.drawDoorRight(distance);
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
        this.drawDoorLeft(distance);
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
    this._painter.lightLevel = this._light_level[distance];
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
    this._painter.lightLevel = this._light_level[distance];
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
    this._painter.lightLevel = this._light_level[distance];
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
    this._painter.lightLevel = this._light_level[distance];
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
    this._painter.lightLevel = this._light_level[distance];
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
    this._painter.lightLevel = this._light_level[distance];
    this._painter.moveTo(229, 38);
    this._painter.lineTo(192, 38);
    this._painter.lineTo(192, 114);
    this._painter.lineTo(229, 114);
    this._painter.moveTo(229, 16);
    this._painter.lineTo(192, 38);
  }

  /**
   * Draw a door wall in front
   * @param { number } distance the distance to determine light level
   * @private
   */
  drawDoorForward(distance) {
    this.drawSolidWall(distance);
    this._painter.moveTo(108, 114);
    this._painter.lineTo(108, 67);
    this._painter.lineTo(148, 67);
    this._painter.lineTo(148, 114);
    this._painter.moveTo(126, 94);
    this._painter.lineTo(130, 94);
  }

  /**
   * Draw a door wall on the right
   * @param { number } distance the distance to determine light level
   * @private
   */
  drawDoorRight(distance) {
    this.drawSolidWallRight(distance);
    this._painter.moveTo(216, 128);
    this._painter.lineTo(216, 65);
    this._painter.lineTo(200, 68);
    this._painter.lineTo(200, 119);
    this._painter.moveTo(208, 92);
    this._painter.lineTo(204, 93);
  }

  /**
   * Draw a door wall on the left
   * @param { number } distance the distance to determine light level
   * @private
   */
  drawDoorLeft(distance) {
    this.drawSolidWallLeft(distance);
    this._painter.moveTo(40, 128);
    this._painter.lineTo(40, 65);
    this._painter.lineTo(56, 68);
    this._painter.lineTo(56, 119);
    this._painter.moveTo(48, 92);
    this._painter.lineTo(52, 93);
  }
}
