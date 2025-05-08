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
    super(ITEM_CLASS.scroll, subclass, 10, reveal_power, revealed);
  }

  use() {
    SoundGenerator.instance.scroll(.5);
  }

  /**
   * @param { Painter } painter
   */
  paint(painter) {
    painter.moveTo(194, 118);
    painter.lineToRelative(-2, 2);
    painter.lineToRelative(8, 6);
    painter.lineToRelative(2, -2);
    painter.lineToRelative(-8, -6);
  }
}
