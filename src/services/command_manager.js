// @ts-check
import { Player, PLAYER_VIEW } from "../models/player";
import { Console } from "./view_console";

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

  /**
   * Process a given command
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
      default:
        Console.instance.append("???");
    }
  }

  /**
   * Process a move command
   * @param { string[] } command 
   * @private
   */
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

  /**
   * Process a move command
   * @param { string[] } command 
   * @private
   */
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

  /**
   * Process a move command
   * @param { string[] } command 
   * @private
   */
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

  process_pull_cammand(command) {
    if (!(command.length >= 3)) Console.instance.append("???");
    const hand = command[1];
    let item = command.splice(2, command.length).join(' ');
    item = item === 't' ? 'torch' : item;
    item = item === 'p t' ? 'pine torch' : item;
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
}
