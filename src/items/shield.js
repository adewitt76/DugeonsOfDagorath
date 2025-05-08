import { SoundGenerator } from "../services/sound_manager";
import { Item, ITEM_CLASS } from "./item";

/** @abstract */
export class Scroll extends Item {

  /** Create a base scroll
   * @param { string } subclass 
   * @param { number } reveal_power 
   * @param { boolean } revealed
   */
  constructor(subclass, reveal_power, revealed) {
    super(ITEM_CLASS.shield, subclass, 25, reveal_power, revealed);
  }

  use() {
  }

  /**
   * @param { Painter } painter
   */
  paint(painter) {
    painter.moveTo(172, 132);
    painter.lineTo(192, 126);
    painter.lineTo(186, 120);
    painter.lineTo(168, 126);
    painter.lineToRelative(-4, 6);
    painter.lineToRelative(8, 0);
  }
}
