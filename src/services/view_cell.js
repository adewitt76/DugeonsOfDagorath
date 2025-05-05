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

  /** Set the light level of the cell the represented
    * array should have 9 numbers. The higher the number
    * the lower the light with the exception of zero 
    * being no light at all
    *  @param { number[] } lightLevel
    */
  set light_level(lightLevel) {
    this._light_level = lightLevel;
  }

  /**
   * Paint the given cell
   * @param { Cell } cell 
   * @param { number } distance the distance in cells from view
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @param { DIRECTION } direction the view direction
   */
  paint(cell, distance, light_level, direction) {
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
        this.paint(cell.cells[/** @type {number} */(direction)], distance + 1, light_level, direction);
        break;
      case WALL_TYPE.solid:
        this.drawSolidWall(distance, light_level);
        break;
      case WALL_TYPE.normal_door:
        this.drawDoorForward(distance, light_level)
        break;
      case WALL_TYPE.magic_door:
        break;
    }

    // 2. paint right
    switch (right) {
      case WALL_TYPE.open:
        this.drawOpenWallRight(distance, light_level);
        break;
      case WALL_TYPE.solid:
        this.drawSolidWallRight(distance, light_level);
        break;
      case WALL_TYPE.normal_door:
        this.drawDoorRight(distance, light_level);
        break;
      case WALL_TYPE.magic_door:
        break;
    }

    // 3. paint left
    switch (left) {
      case WALL_TYPE.open:
        this.drawOpenWallLeft(distance, light_level);
        break;
      case WALL_TYPE.solid:
        this.drawSolidWallLeft(distance, light_level);
        break;
      case WALL_TYPE.normal_door:
        this.drawDoorLeft(distance, light_level);
        break;
      case WALL_TYPE.magic_door:
        break;
    }

    // 4. paint center
    switch (center) {
      default:
        this.ceiling(distance, light_level);
    }
    // 5. paint inventory
    // 5. paint creature;
  }

  /**
   * Draw a single line ceiling
   * @param { number } distance the distance to determine light level
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  ceiling(distance, light_level) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = light_level;
    this._painter.moveTo(47, 28);
    this._painter.lineTo(210, 28);
  }

  /**
   * Draw a solid wall on the left
   * @param { number } distance the distance to determine light level
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  drawSolidWall(distance, light_level) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = light_level;
    this._painter.moveTo(64, 38);
    this._painter.lineTo(192, 38);
    this._painter.moveTo(64, 114);
    this._painter.lineTo(192, 114);
  }

  /**
   * Draw a solid wall on the left
   * @param { number } distance the distance to determine light level
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  drawSolidWallLeft(distance, light_level) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = light_level;
    this._painter.moveTo(27, 16);
    this._painter.lineTo(64, 38);
    this._painter.lineTo(64, 114);
    this._painter.lineTo(27, 136);
  }

  /**
   * Draw a solid wall on the right
   * @param { number } distance the distance to determine light level
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  drawSolidWallRight(distance, light_level) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = light_level;
    this._painter.moveTo(229, 16);
    this._painter.lineTo(192, 38);
    this._painter.lineTo(192, 114);
    this._painter.lineTo(229, 136);
  }

  /**
   * Draw a open wall on the left
   * @param { number } distance the distance to determine light level
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  drawOpenWallLeft(distance, light_level) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = light_level;
    this._painter.moveTo(26, 38);
    this._painter.lineTo(64, 38);
    this._painter.lineTo(64, 114);
    this._painter.lineTo(27, 114);
    this._painter.moveTo(27, 16);
    this._painter.lineTo(64, 38);
  }

  /**
   * Draw a open wall on the right
   * @param { number } distance the distance to determine light level
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  drawOpenWallRight(distance, light_level) {
    this._painter.distance = distance;
    this._painter.color = 'white';
    this._painter.lightLevel = light_level;
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
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  drawDoorForward(distance, light_level) {
    this.drawSolidWall(distance, light_level);
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
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  drawDoorRight(distance, light_level) {
    this.drawSolidWallRight(distance, light_level);
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
   * @param { number } light_level a number between 0 to 13 0 being no light 13 being max light
   * @private
   */
  drawDoorLeft(distance, light_level) {
    this.drawSolidWallLeft(distance, light_level);
    this._painter.moveTo(40, 128);
    this._painter.lineTo(40, 65);
    this._painter.lineTo(56, 68);
    this._painter.lineTo(56, 119);
    this._painter.moveTo(48, 92);
    this._painter.lineTo(52, 93);
  }
}
