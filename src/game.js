// @ts-check
import { Player, PLAYER_VIEW } from "./models/player";
import { Painter } from "./services/painter";
import { CellView } from "./services/view_cell";
import { StatusBar } from "./services/view_status_bar";
import { Console } from "./services/view_console";
import { Stage } from "./services/stage";
import { MapView } from "./services/view_map";
import { InventoryView } from "./services/view_inventory";
import { DebugOverlay } from "./services/view_debug";
import { Level } from "./models/level";
import { DungeonGenerator } from "./services/dungeon_generator";
import { Cell } from "./models/cell";

export class Game {

  /** @private @type {Game} */
  static _instance;

  /** @private @type { Player }*/
  _player;

  /** @private @type { Level[] } */
  _levels;

  /** @private @type { MapView } */
  _map_view;

  /** @private */
  constructor() {
    const dungeon_generator = new DungeonGenerator();
    this._levels = dungeon_generator.generateDungeon();
    const starting_position = dungeon_generator.generate_player_starting_location(this._levels[0]);
    const starting_direction = dungeon_generator.generate_player_starting_direction(starting_position, this._levels[0]);
    this._player = Player.initialize(starting_position, starting_direction);
    this._show_debug = false;
    this._map_view = new MapView();
  }

  /**
   * Get the instance of the game
   * @returns {Game}
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new Game();
    return this._instance;
  }

  get levels() {
    return this._levels;
  }

  /** get the current cell of the player
    * @returns { Cell }
    */
  get players_cell() {
    return this._levels[this._player.level - 1].getCell(this._player.position.x, this._player.position.y);
  }

  start() {
    requestAnimationFrame(this.play);
  }

  last_heart_beat_time = 0;

  /** The main game loop. This relies on the browsers animation loop.
   * @param { number } time_stamp the time stamp given by requestAnimationFrame()
   */
  play = (time_stamp) => {
    this.draw_screen();
    this.beat_heart(time_stamp);
    requestAnimationFrame(this.play);
  };

  draw_screen() {
    const stage = Stage.instance;
    const painter = new Painter();
    painter.color = 'white';

    switch (this._player.view) {
      case PLAYER_VIEW.inventory_view:
        InventoryView.instance.paint();
        StatusBar.instance.paint();
        Console.instance.paint();
        break;
      case PLAYER_VIEW.main_view:
        const magic_illumination = this._player.lit_torch?.magic_illumination || 0;
        CellView.instance.paint(this.players_cell, 0, this._player.light_level, magic_illumination, this._player.direction);
        StatusBar.instance.paint();
        Console.instance.paint();
        break;
      case PLAYER_VIEW.map_view_vision_scroll:
        this._map_view.draw_map();
        break;
      case PLAYER_VIEW.map_view_seer_scroll:
        this._map_view.draw_map();
        break;
    }

    DebugOverlay.instance.paint();

    stage.swapBuffers();
  }

  beat_heart(time_stamp) {
    if ((this.last_heart_beat_time + (this._player.heart_rate / 60)) < time_stamp / 1000) {
      // every heart beat show a beat and heal some of players damage
      this.last_heart_beat_time = time_stamp / 1000;
      StatusBar.instance.beat_heart();
      this._player.heal();
    }
  }
}
