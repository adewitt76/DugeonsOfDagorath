// @ts-check
import { Player, PLAYER_VIEW } from "./models/player";
import { Painter } from "./services/painter";
import { CellView } from "./services/view_cell";
import { StatusBar } from "./services/view_status_bar";
import { Console } from "./services/view_console";
import { Stage } from "./services/stage";
import { LevelList } from "./Levels/level_list";
import { MapView } from "./services/view_map";
import { InventoryView } from "./services/view_inventory";
import { DebugOverlay } from "./services/view_debug";

export class Game {

  /** @private @type { Player }*/
  _player;

  /** @private @type { LevelList } */
  _level_list;

  /** @private @type { MapView } */
  _map_view;

  constructor() {
    this._level_list = LevelList.instance;
    const starting_position = this._level_list.player_starting_location;
    const starting_direction = this._level_list.get_player_starting_direction(starting_position);
    this._player = Player.initialize(starting_position, starting_direction);
    this._show_debug = false;
    this._map_view = new MapView();
  }

  start() {
    requestAnimationFrame(this.play);
  }

  play = () => {
    const stage = Stage.instance;

    const painter = new Painter();
    painter.color = 'white';

    const players_cell = this._level_list.getCell(0, this._player.position.x, this._player.position.y);

    switch (this._player.view) {
      case PLAYER_VIEW.inventory_view:
        InventoryView.instance.paint();
        StatusBar.instance.paint();
        Console.instance.paint();
        break;
      case PLAYER_VIEW.main_view:
        const magic_illumination = this._player.lit_torch?.magic_illumination || 0;
        CellView.instance.paint(players_cell, 0, this._player.light_level, magic_illumination, this._player.direction);
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
    requestAnimationFrame(this.play);
  };
}
