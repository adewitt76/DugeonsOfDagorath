// @ts-check
import { Player, PLAYER_VIEW } from "./models/player";
import { Painter } from "./services/painter";
import { CellView } from "./services/view_cell";
import { StatusBar } from "./services/view_status_bar";
import { Console } from "./services/view_console";
import { Stage } from "./services/stage";
import { LevelList } from "./Levels/level_list";

export class Game {

  /** @private @type { Player }*/
  _player;

  /** @private @type { LevelList } */
  _level_list;

  constructor() {
    this._level_list = LevelList.instance;
    const starting_position = this._level_list.player_starting_location;
    const starting_direction = this._level_list.get_player_starting_direction(starting_position);
    this._player = Player.initialize(starting_position, starting_direction);
  }

  play() {
    /** @type { number[] } */
    const pine_torch_full = [1, 2, 4, 8, 0, 0, 0, 0];
    /** @type { number[] } */
    const lunar_torch_full = [1, 1, 1, 1, 2, 8, 0, 0];
    /** @type { number[] } */
    const solar_torch_full = [1, 1, 1, 1, 1, 1, 1, 1];

    setInterval(() => {
      const stage = Stage.instance;
      const painter = new Painter();
      let torch = pine_torch_full;

      painter.color = 'white';

      const players_cell = this._level_list.getCell(0, this._player.position.x, this._player.position.y);

      switch (this._player.view) {
        case PLAYER_VIEW.main_view:
          CellView.instance.paint(players_cell, 0, this._player.direction);
          StatusBar.instance.paint();
          Console.instance.paint();
          break;
        case PLAYER_VIEW.map_view:
          this._player.items.scroll.draw_map();
          break;
      }

      stage.swapBuffers();
    }, 16.67)
  }
}
