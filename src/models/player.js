// @ts-check
import { DIRECTION, ROOM_CENTER, WALL_TYPE } from "./cell";
import { Point } from "./point";
import { Item, ITEM_CLASS } from "../items/item";
import { PineTorch } from "../items/torch_pine";
import { LunarTorch } from "../items/torch_lunar";
import { SolarTorch } from "../items/torch_solar";
import { Torch } from "../items/torch";
import { VisionScroll } from "../items/scroll_vision";
import { Game } from "../game";
import { AnimationManager } from "../services/animation_manager";
import { LeftToRightTurnAnimation } from "../animations/left_right_turn";
import { RightToLeftTurnAnimation } from "../animations/right_left_turn";

export const PLAYER_VIEW = Object.freeze({
  inventory_view: 'inventory_view',
  main_view: 'main_view',
  map_view_vision_scroll: 'map_view_vision_scroll',
  map_view_seer_scroll: 'map_view_seer_scroll'
})

export class Player {

  /** @private @type { Player } */
  static _instance;

  /** The power of the player used to reveal, attack, run
   * intial power is 160 not to exceed 32,767
   * @private @type { number } 
   */
  _power;

  /** The encured damage of the player if this number
   * exceeds the power the player dies.
   * @private @type { number }
   */
  _damage;

  /** @private @type { number } */
  _level;

  /** @private @type { Point } */
  _position;

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

  /** @private @type { Torch | undefined } */
  _lit_torch;

  /** @private @type { boolean } */
  _has_fainted = false;

  /** @private @type { boolean } */
  _is_dead = false;

  /**
   * @param { Point } position
   * @param { DIRECTION } direction
   * @private 
   */
  constructor(position, direction) {
    this._position = position;
    this._direction = direction;
    this._level = 1;
    this._power = 160;
    this._damage = 0;
    this._view = PLAYER_VIEW.main_view;
    this._items = [
      new PineTorch(true),
      new VisionScroll(true),
      new SolarTorch(true),
      new LunarTorch(true)
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

  /** The delay between heart beats
   * @returns { number }
   */
  get jiffy_score() {
    return Math.trunc((this._power * 64) / (this._power + (this._damage * 2))) - 18;
  }

  /** The delay between heart beats
   * @returns { number }
   */
  get heart_rate() {
    return Math.trunc(3600 / this.jiffy_score);
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

  /** Sets the current level of the Player
   * @return { number } 
   */
  get level() {
    return this._level;
  }

  /** The lit torches light level
   * @return { number }
   */
  get light_level() {
    return this._lit_torch?.light_level ?? 0;
  }

  /** The lit torches light level
   * @return { Torch | undefined }
   */
  get lit_torch() {
    return this._lit_torch;
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

  /** The direction the player is pointed
   * @return { DIRECTION }
   */
  get direction() {
    return this._direction;
  }

  /** The current power of the player
   * @return { number }
   */
  get power() {
    return this._power;
  }

  /** The current power of the player
   * @return { number }
   */
  get damage() {
    return this._damage;
  }

  get has_fainted() {
    return this._has_fainted;
  }

  get is_dead() {
    return this._is_dead;
  }

  /** The current power of the player
   * @return { number }
   */
  get total_weight() {
    return this._items.map(i => i.weight).reduce((pv, cv) => pv + cv) +
      (this._right_hand?._weight || 0) + (this._left_hand?._weight || 0);
  }

  /** determine current health and status of the player */
  updatePlayer() {
    if (this._damage > this._power) this._is_dead = true;
    if (!this._has_fainted && (this.jiffy_score <= 3)) this._has_fainted = true;
    if (this._has_fainted && (this.jiffy_score >= 10)) this._has_fainted = false;
  }

  /** Use item is left hand
   * @return { boolean } successful
   */
  useLeft() {
    if (!this._left_hand) return false;
    if (this._left_hand.class_name === ITEM_CLASS.torch) {
      this._lit_torch?.putOut();
      this._lit_torch = undefined;
    }
    this._left_hand.use();
    if (this._left_hand.class_name === ITEM_CLASS.torch) {
      this._lit_torch = /**@type{Torch}*/(this._left_hand);
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
      this._lit_torch?.putOut();
      this._lit_torch = undefined;
    }
    this._right_hand.use();
    if (this._right_hand.class_name === ITEM_CLASS.torch) {
      this._lit_torch = /**@type{Torch}*/(this._right_hand);
      this.stowRight();
    }
    return true;
  }

  /** Pull item to left hand using string name of the item
   * @param { string } item 
   * @return { boolean } successful
   */
  pullLeft(item) {
    if (this._left_hand) return false;
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
    if (this._right_hand) return false;
    let index = this.items.findIndex((i) => i.toString() === item);
    index = index === -1 ? this.items.findIndex(i => i.class_name === item) : index;
    if (index === -1) return false;
    this._right_hand = this.items.splice(index, 1)[0];
    return true;
  }

  /** Pick up item from cell to left hand using string name of the item
   * @param { string } item 
   * @return { boolean } successful
   */
  getLeft(item) {
    if (this._left_hand) return false;
    let cell_inventory = Game.instance.players_cell.inventory;
    let index = cell_inventory.findIndex((i) => i.toString() === item);
    index = index === -1 ? cell_inventory.findIndex(i => i.class_name === item) : index;
    if (index === -1) return false;
    this._left_hand = cell_inventory.splice(index, 1)[0];
    if ((this._left_hand.full_name.toLowerCase() === "vision scroll") && this._level < 4) {
      const cell_data = Game.instance.levels[3].getRandomOpenCell();
      this._level = 4;
      this._position = new Point(cell_data.col, cell_data.row);
    }
    return true;
  }

  /** Pick up item from cell to right hand using string name of the item
   * @param { string } item 
   * @return { boolean } successful
   */
  getRight(item) {
    if (this._right_hand) return false;
    let cell_inventory = Game.instance.players_cell.inventory;
    let index = cell_inventory.findIndex((i) => i.toString() === item);
    index = index === -1 ? cell_inventory.findIndex(i => i.class_name === item) : index;
    if (index === -1) return false;
    this._right_hand = cell_inventory.splice(index, 1)[0];
    if ((this._right_hand.full_name.toLowerCase() === "vision scroll") && this._level < 4) {
      const cell_data = Game.instance.levels[3].getRandomOpenCell();
      this._level = 4;
      this._position = new Point(cell_data.col, cell_data.row);
    }
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

  /** Attempt to reveal the object in left hand */
  revealLeft() {
    if (!this._left_hand) return false;
    this._left_hand?.reveal();
    return true;
  }

  /** Attempt to reveal the object in right hand */
  revealRight() {
    if (!this._right_hand) return false;
    this._right_hand?.reveal();
    return true;
  }

  dropLeft() {
    if (!this._left_hand) return false;
    Game.instance.players_cell.inventory.push(this._left_hand);
    this._left_hand = undefined;
    return true;
  }

  dropRight() {
    if (!this._right_hand) return false;
    Game.instance.players_cell.inventory.push(this._right_hand);
    this._right_hand = undefined;
    return true;
  }

  moveForward() {
    this.add_movement_damage();
    const current_cell = Game.instance.players_cell;
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
  }

  moveBackward() {
    this.add_movement_damage();
    const current_cell = Game.instance.players_cell;
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
  }

  moveRight() {
    this.add_movement_damage();
    const current_cell = Game.instance.players_cell;
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
  }

  moveLeft() {
    this.add_movement_damage();
    const current_cell = Game.instance.players_cell;
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
  }

  turnLeft() {
    AnimationManager.instance.add(new LeftToRightTurnAnimation());
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
    AnimationManager.instance.add(new RightToLeftTurnAnimation());
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
    AnimationManager.instance.add(new RightToLeftTurnAnimation());
    AnimationManager.instance.add(new RightToLeftTurnAnimation());
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

  /**
   * Attempt to climb up a ladder
   * @returns {boolean} Whether the climb was successful
   */
  climbUp() {
    this.add_movement_damage();
    const current_cell = Game.instance.players_cell;
    if (current_cell.center !== ROOM_CENTER.ladder_up) return false;
    this._level--;
    return true;
  }

  /**
   * Attempt to climb down a ladder or through a hole
   * @returns {boolean} Whether the climb was successful
   */
  climbDown() {
    this.add_movement_damage();
    const current_cell = Game.instance.players_cell;
    if (current_cell.center !== ROOM_CENTER.ladder_down &&
      current_cell.center !== ROOM_CENTER.hole_floor) {
      return false;
    }
    this._level++;
    return true;
  }

  /** Heal some damage */
  heal() {
    if (this._damage > 0)
      this._damage = this.damage - Math.trunc(this.damage / 64);
  }

  add_movement_damage() {
    const damage = Math.trunc(this.total_weight / 8) + 3;
    this._damage += damage;
  }

}
