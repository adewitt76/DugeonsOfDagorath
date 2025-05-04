// @ts-check
import { LevelList } from "../Levels/level_list";
import { DIRECTION, WALL_TYPE } from "./cell";
import { Point } from "./point";
import { Item, ITEM_CLASS } from "../items/item";
import { PineTorch } from "../items/torch_pine";
import { Torch } from "../items/torch";

export const PLAYER_VIEW = Object.freeze({
  inventory_view: 'inventory_view',
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

  /** @private @type { Item[] } */
  _items;

  /** @private @type { Item | undefined } */
  _left_hand;

  /** @private @type { Item | undefined } */
  _right_hand;

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
    this._items = [
      new PineTorch(false),
      new PineTorch(true)
    ];
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
   * Gets the current position of the Player
   * @return { Point } 
   */
  get position() {
    return this._position;
  }

  /** Get the text for the item in the left hand
   * @return { string } 
   */
  get left_hand_item_text() {
    return this._left_hand ? this._left_hand.toString() : 'empty';
  }

  /** Get the text for the item in the left hand
   * @return { string } 
   */
  get right_hand_item_text() {
    return this._right_hand ? this._right_hand.toString() : 'empty';
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
    *  @type { Item[] } 
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

  /** Use item is left hand
    * @return { boolean } successful
    */
  useLeft() {
    if (!this._left_hand) return false;
    if (this._left_hand.class_name === ITEM_CLASS.torch) {
      this.items.forEach(i => {
        if (i.class_name === ITEM_CLASS.torch) {
          /**@type { Torch }*/(i).putOut();
        }
      });
    }
    this._left_hand.use();
    if (this._left_hand.class_name === ITEM_CLASS.torch) {
      this.stowLeft();
    }
    return true;
  }

  /** Use item is right hand
    * @return { boolean } successful
    */
  useRight() {
    if (!this._right_hand) return false;
    if (this._right_hand.class_name === ITEM_CLASS.torch) {
      this.items.forEach(i => {
        if (i.class_name === ITEM_CLASS.torch) {
          /**@type { Torch }*/(i).putOut();
        }
      });
    }
    this._right_hand.use();
    if (this._right_hand.class_name === ITEM_CLASS.torch) {
      this.stowRight();
    }
    return true;
  }

  /** Pull item to left hand using string name of the item
    * @param { string } item 
    * @return { boolean } successful
    */
  pullLeft(item) {
    let index = this.items.findIndex((i) => i.toString() === item);
    index = index === -1 ? this.items.findIndex(i => i.class_name === item) : index;
    if (index === -1) return false;
    this._left_hand = this.items.splice(index, 1)[0];
    return true;
  }

  /** Pull item to right hand using string name of the item
    * @param { string } item 
    * @return { boolean } successful
    */
  pullRight(item) {
    let index = this.items.findIndex((i) => i.toString() === item);
    index = index === -1 ? this.items.findIndex(i => i.class_name === item) : index;
    if (index === -1) return false;
    this._right_hand = this.items.splice(index, 1)[0];
    return true;
  }

  /** Stow the item in the left hand
    * @return { boolean } successful
    */
  stowLeft() {
    if (!this._left_hand) return false;
    this.items.push(this._left_hand);
    this._left_hand.stow();
    this._left_hand = undefined;
    return true;
  }

  /** Stow the item in the Right hand
    * @return { boolean } successful
    */
  stowRight() {
    if (!this._right_hand) return false;
    this.items.push(this._right_hand);
    this._right_hand.stow();
    this._right_hand = undefined;
    return true;
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

