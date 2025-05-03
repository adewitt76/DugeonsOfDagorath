// @ts-check
import { MapView } from "../services/view_map";
import { LevelList } from "../Levels/level_list";
import { DIRECTION, WALL_TYPE } from "./cell";
import { Point } from "./point";

export const PLAYER_VIEW = Object.freeze({
  main_view: 'main_view',
  map_view: 'map_view',
})
export class Player {

  /** @private @type { Player } */
  static _instance;

  /** @private @type { Point } */
  _position;

  /** @private @type { number } */
  _level;

  /** @private @type { DIRECTION } */
  _direction;

  /** @private @type { string } */
  _view;

  /** @private @type {{ scroll: MapView }} */
  _items;

  /**
   * @param { Point } position
   * @param { DIRECTION } direction
   * @private 
   */
  constructor(position, direction) {
    this._position = position;
    this._direction = direction;
    this._level = 1;
    this._view = PLAYER_VIEW.main_view;
    this._items = { scroll: new MapView() };
  }

  /**
   * Get the instance of the stage
   * @param { Point } position
   * @param { DIRECTION } direction
   * @returns { Player }
   */
  static initialize(position, direction) {
    if (this._instance) throw new Error('Player already initialized');
    this._instance = new Player(position, direction);
    return this._instance;
  }

  /**
   * Get the instance of the stage
   * @returns { Player }
   */
  static get instance() {
    if (!this._instance) throw new Error('Player has not been intialized');
    return this._instance;
  }

  /**
   * Sets the current position of the Player
   * @return { Point } 
   */
  get position() {
    return this._position;
  }

  /**
   * Sets the current position of the Player
   * @return { number } 
   */
  get level() {
    return this._level;
  }

  /** The current players view
    * @return { string }
    */
  get view() {
    return this._view;
  }

  /** The current players view
    * @param { string } view
    */
  set view(view) {
    this._view = view;
  }

  /** The current players items
    *  @type {{ scroll: MapView }} 
    */
  get items() {
    return this._items;
  }

  /**
   * The direction the player is pointed
   * @return { DIRECTION }
   */
  get direction() {
    return this._direction;
  }

  moveForward() {
    const current_cell = LevelList.instance.getCell(this._level - 1, this.position.x, this.position.y);
    switch (this.direction) {
      case DIRECTION.north:
        if (current_cell.walls[DIRECTION.north] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x, this.position.y - 1);
        break;
      case DIRECTION.south:
        if (current_cell.walls[DIRECTION.south] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x, this.position.y + 1);
        break;
      case DIRECTION.east:
        if (current_cell.walls[DIRECTION.east] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x + 1, this.position.y);
        break;
      case DIRECTION.west:
        if (current_cell.walls[DIRECTION.west] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x - 1, this.position.y);
        break;
    }
    console.log('position [', this.position.y, '][', this.position.x, ']');
  }

  moveBackward() {
    const current_cell = LevelList.instance.getCell(this._level - 1, this.position.x, this.position.y);
    switch (this.direction) {
      case DIRECTION.north:
        if (current_cell.walls[DIRECTION.south] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x, this.position.y + 1);
        break;
      case DIRECTION.south:
        if (current_cell.walls[DIRECTION.north] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x, this.position.y - 1);
        break;
      case DIRECTION.east:
        if (current_cell.walls[DIRECTION.west] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x - 1, this.position.y);
        break;
      case DIRECTION.west:
        if (current_cell.walls[DIRECTION.east] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x + 1, this.position.y);
        break;
    }
    console.log('position [', this.position.y, '][', this.position.x, ']');
  }

  moveRight() {
    const current_cell = LevelList.instance.getCell(this._level - 1, this.position.x, this.position.y);
    switch (this.direction) {
      case DIRECTION.north:
        if (current_cell.walls[DIRECTION.east] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x + 1, this.position.y);
        break;
      case DIRECTION.south:
        if (current_cell.walls[DIRECTION.west] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x - 1, this.position.y);
        break;
      case DIRECTION.east:
        if (current_cell.walls[DIRECTION.south] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x, this.position.y + 1);
        break;
      case DIRECTION.west:
        if (current_cell.walls[DIRECTION.north] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x, this.position.y - 1);
        break;
    }
    console.log('position [', this.position.y, '][', this.position.x, ']');
  }

  moveLeft() {
    const current_cell = LevelList.instance.getCell(this._level - 1, this.position.x, this.position.y);
    switch (this.direction) {
      case DIRECTION.north:
        if (current_cell.walls[DIRECTION.west] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x - 1, this.position.y);
        break;
      case DIRECTION.south:
        if (current_cell.walls[DIRECTION.east] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x + 1, this.position.y);
        break;
      case DIRECTION.east:
        if (current_cell.walls[DIRECTION.north] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x, this.position.y - 1);
        break;
      case DIRECTION.west:
        if (current_cell.walls[DIRECTION.south] === WALL_TYPE.solid) return;
        this._position = new Point(this.position.x, this.position.y + 1);
        break;
    }
    console.log('position [', this.position.y, '][', this.position.x, ']');
  }

  turnLeft() {
    switch (this.direction) {
      case DIRECTION.north:
        this._direction = DIRECTION.west;
        break;
      case DIRECTION.south:
        this._direction = DIRECTION.east;
        break;
      case DIRECTION.east:
        this._direction = DIRECTION.north;
        break;
      case DIRECTION.west:
        this._direction = DIRECTION.south;
        break;
    }
  }

  turnRight() {
    switch (this.direction) {
      case DIRECTION.north:
        this._direction = DIRECTION.east;
        break;
      case DIRECTION.south:
        this._direction = DIRECTION.west;
        break;
      case DIRECTION.east:
        this._direction = DIRECTION.south;
        break;
      case DIRECTION.west:
        this._direction = DIRECTION.north;
        break;
    }
  }

  turnAround() {
    switch (this.direction) {
      case DIRECTION.north:
        this._direction = DIRECTION.south;
        break;
      case DIRECTION.south:
        this._direction = DIRECTION.north;
        break;
      case DIRECTION.east:
        this._direction = DIRECTION.west;
        break;
      case DIRECTION.west:
        this._direction = DIRECTION.east;
        break;
    }
  }
}

