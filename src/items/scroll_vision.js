// @ts-check
import { Player, PLAYER_VIEW } from "../models/player";
import { Scroll } from "./scroll";

export class VisionScroll extends Scroll {

  /** Create a base scroll
   * @param { boolean } revealed
   */
  constructor(revealed) {
    super('vision', 1250, revealed);
  }

  /** Open the map not showing creatures or items */
  use() {
    if (this._revealed) {
      Player.instance.view = PLAYER_VIEW.map_view_vision_scroll;
      super.use();
    }
  }
}
