// @ts-check
import { Painter } from "./painter";
import { LevelList } from "../Levels/level_list";
import { Player } from "../models/player";

export class MapView {
  /** @private @type { LevelList } */
  _map;

  constructor() {
    this._map = LevelList.instance;
  }

  /** Draw a 32x32 square level map on a 256px x 192px screen
  * @return { void }
  */
  draw_map() {
    const map = this._map.getLevelMap(Player.instance.level - 1);
    const cell_height = 6;
    const cell_width = 8;
    for (let r = 0; r < 32; r++) {
      for (let c = 0; c < 32; c++) {
        if (!map || !map[r] || !map[r][c] || map[r][c].is_solid) {
          this.draw_solid_map_square(r * cell_height, c * cell_width, 'white');
        } else {
          this.draw_solid_map_square(r * cell_height, c * cell_width, 'black');
        }
      }
    }
    this.draw_player_location(Player.instance.position.y * cell_height, Player.instance.position.x * cell_width, 'white');
  }

  /** Draw a single square on the map. The map is devided into a 32x32 
  * block grid making the block 6px high and 8px wide.
  * @param { number } row The vertical location
  * @param { number } column The horizontal location
  * @param { string } color The color the cell should be painted
  * @return { void }
  * @private
  */
  draw_solid_map_square(row, column, color) {
    const painter = new Painter();
    painter.color = color;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 8; c++) {
        painter.drawPixel(column + c, row + r);
      }
    }
  }

  /** Draw the players location which is an X
  * @param { number } row The vertical location
  * @param { number } column The horizontal location
  * @param { string } color The color the cell should be painted
  * @return { void }
  * @private
  */
  draw_player_location(row, column, color) {
    const painter = new Painter();
    painter.color = color;
    painter.drawPixel(column + 2, row + 1);
    painter.drawPixel(column + 5, row + 1);

    painter.drawPixel(column + 3, row + 2);
    painter.drawPixel(column + 4, row + 2);
    painter.drawPixel(column + 3, row + 3);
    painter.drawPixel(column + 4, row + 3);

    painter.drawPixel(column + 2, row + 4);
    painter.drawPixel(column + 5, row + 4);
  }
}
