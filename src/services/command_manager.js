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
    this._player.view = PLAYER_VIEW.main_view;
    switch (parsed_command[0]) {
      case 'move':
      case 'm':
        this.process_move_command(parsed_command);
        break;
      case 'turn':
      case 't':
        this.process_turn_command(parsed_command);
        break;
      case 'use':
        this.process_use_command(parsed_command);
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
    switch (command[1]) {
      case 'scroll':
        this._player.view = PLAYER_VIEW.map_view;
        break;
    }
  }
}
