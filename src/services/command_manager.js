// @ts-check
import { Player, PLAYER_VIEW } from "../models/player";
import { Console } from "./view_console";
import { DebugOverlay } from "./view_debug";

export class CommandManager {

  /** @private @type { CommandManager } */
  static _instance;

  /** @private */
  constructor() {
    this._player = Player.instance;
  }

  /**
   * Get the instance of the stage
   * @returns { CommandManager }
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new CommandManager();
    return this._instance;
  }

  /** Process a given command
   * @param { string } command 
   */
  process(command) {
    const parsed_command = command.trim().toLowerCase().split(' ');
    switch (parsed_command[0]) {
      case 'move':
      case 'm':
        this.process_move_command(parsed_command);
        break;
      case 'turn':
      case 't':
        this.process_turn_command(parsed_command);
        break;
      case 'pull':
      case 'p':
        this.process_pull_cammand(parsed_command);
        break;
      case 'get':
      case 'g':
        this.process_get_cammand(parsed_command);
        break;
      case 'stow':
      case 's':
        this.process_stow_command(parsed_command);
        break;
      case 'use':
      case 'u':
        this.process_use_command(parsed_command);
        break;
      case 'examine':
      case 'e':
        this._player.view = PLAYER_VIEW.inventory_view;
        break;
      case 'look':
      case 'l':
        this._player.view = PLAYER_VIEW.main_view;
        break;
      case 'reveal':
      case 'r':
        this.process_reveal_command(parsed_command);
        break;
      case 'drop':
      case 'd':
        this.process_drop_command(parsed_command);
        break;
      case 'dbg':
        this.process_debug_command(parsed_command);
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_move_command(command) {
    switch (command[1]) {
      case undefined:
        Player.instance.moveForward();
        break;
      case 'back':
      case 'b':
        Player.instance.moveBackward();
        break;
      case 'right':
      case 'r':
        Player.instance.moveRight();
        break;
      case 'left':
      case 'l':
        Player.instance.moveLeft();
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_turn_command(command) {
    switch (command[1]) {
      case 'right':
      case 'r':
        Player.instance.turnRight();
        break;
      case 'left':
      case 'l':
        Player.instance.turnLeft();
        break;
      case 'around':
      case 'a':
        Player.instance.turnAround();
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_use_command(command) {
    const hand = command[1];
    switch (hand) {
      case 'left':
      case 'l':
        if (!Player.instance.useLeft()) Console.instance.append("???");
        break;
      case 'right':
      case 'r':
        if (!Player.instance.useRight()) Console.instance.append("???");
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_pull_cammand(command) {
    if (!(command.length >= 3)) Console.instance.append("???");
    const hand = command[1];
    let item = this.process_item_acronym(command);
    switch (hand) {
      case 'left':
      case 'l':
        if (!Player.instance.pullLeft(item)) Console.instance.append("???");
        break;
      case 'right':
      case 'r':
        if (!Player.instance.pullRight(item)) Console.instance.append("???");
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_get_cammand(command) {
    if (!(command.length >= 3)) Console.instance.append("???");
    const hand = command[1];
    let item = this.process_item_acronym(command);
    switch (hand) {
      case 'left':
      case 'l':
        if (!Player.instance.getLeft(item)) Console.instance.append("???");
        break;
      case 'right':
      case 'r':
        if (!Player.instance.getRight(item)) Console.instance.append("???");
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_item_acronym(command) {
    let item = command.splice(2, command.length).join(' ');
    item = item === 't' ? 'torch' : item;
    item = item === 'p t' ? 'pine torch' : item;
    item = item === 'l t' ? 'lunar torch' : item;
    item = item === 's t' ? 'solar torch' : item;
    item = item === 'sc' ? 'scroll' : item;
    item = item === 'vi sc' ? 'vision scroll' : item;
    return item;
  }

  /** @param { string[] } command @private */
  process_stow_command(command) {
    const hand = command[1];
    switch (hand) {
      case 'left':
      case 'l':
        if (!Player.instance.stowLeft()) Console.instance.append("???");
        break;
      case 'right':
      case 'r':
        if (!Player.instance.stowRight()) Console.instance.append("???");
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_reveal_command(command) {
    const hand = command[1];
    switch (hand) {
      case 'left':
      case 'l':
        if (!Player.instance.revealLeft()) Console.instance.append("???");
        break;
      case 'right':
      case 'r':
        if (!Player.instance.revealRight()) Console.instance.append("???");
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_drop_command(command) {
    const hand = command[1];
    switch (hand) {
      case 'left':
      case 'l':
        if (!Player.instance.dropLeft()) Console.instance.append("???");
        break;
      case 'right':
      case 'r':
        if (!Player.instance.dropRight()) Console.instance.append("???");
        break;
      default:
        Console.instance.append("???");
    }
  }

  /** @param { string[] } command @private */
  process_debug_command(command) {
    switch (command[1]) {
      case 'on':
        DebugOverlay.instance.show();
        break;
      case 'off':
        DebugOverlay.instance.hide();
        break;
      default:
        Console.instance.append("???");
        break;
    }
  }
}
