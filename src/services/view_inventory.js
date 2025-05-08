// @ts-check

import { print_character } from "../models/font";
import { Item, ITEM_CLASS } from "../items/item";
import { Player } from "../models/player";
import { Painter } from "./painter";
import { LevelList } from "../Levels/level_list";
import { Torch } from "../items/torch";

export class InventoryView {
  /** @private @type { InventoryView } */
  static _instance;

  /** @private @type { Painter } */
  _painter;

  /** @private @type { boolean } */
  _colors_inverted;

  /** @private */
  constructor() {
    this._painter = new Painter();
    this._colors_inverted = false;
  }

  /** 
   * Gets the singleton instance of the console.
   * @return { InventoryView } 
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new InventoryView();
    return this._instance;
  }

  /**
   * Invert the colors for white display.
   * @param { boolean } invert
   */
  set invert(invert) {
    this._colors_inverted = invert;
  }

  /**
   * Paint the status bar.
   * @return { void }
   */
  paint() {
    let line = 0;
    const player = Player.instance;
    const players_cell = LevelList.instance.getCell(player.level - 1, player.position.x, player.position.y);
    let creature = !!players_cell.creature;
    const background_color = this._colors_inverted ? 'white' : 'black';
    this._painter.color = background_color;
    this._painter.distance = 1;
    this._painter.lightLevel = 1;

    this.print_centered_text(line++ * 8, 'in this room');
    if (creature) this.print_centered_text(line++ * 8, '!creature!');
    line += this.print_item_list(line * 8, players_cell.inventory);

    for (let i = 0; i < 32; i++) {
      print_character('!', i * 8, line * 8, this._colors_inverted);
    }
    line++;

    this.print_centered_text(line++ * 8, 'backpack');
    this.print_item_list(line * 8, player.items);
  }

  /** Prints text centered on given line
    * @param { number } line 
    * @param { string } text
    * @return { number } the next line
    * @private 
    */
  print_centered_text(line, text) {
    let starting_character = 16 - (Math.trunc(text.length / 2) + (text.length % 2));
    for (let i = 0; i < text.length; i++) {
      print_character(text[i], starting_character++ * 8, line, this._colors_inverted);
    }
    return line++;
  }

  /** Prints an Item list starting at the given line
    * @param { number } starting_line
    * @param { Item[] } item_list 
    * @return { number } the number of lines printed
    * @private
    */
  print_item_list(starting_line, item_list) {
    let line = starting_line;
    for (let i = 0; i < item_list.length; i += 2) {
      const item = item_list[i];
      const invertColors = item.class_name === ITEM_CLASS.torch && /** @type { Torch } */(item).isLit && !this._colors_inverted;
      let starting_character = 0;
      for (let i = 0; i < item.toString().length; i++) {
        print_character(item.toString()[i], starting_character++ * 8, line, invertColors);
      }
      line += 8;
    }
    line = starting_line;
    for (let i = 1; i < item_list.length; i += 2) {
      const item = item_list[i];
      const invertColors = item.class_name === ITEM_CLASS.torch && /** @type { Torch } */(item).isLit && !this._colors_inverted;
      let starting_character = 16;
      for (let i = 0; i < item.toString().length; i++) {
        print_character(item.toString()[i], starting_character++ * 8, line, invertColors);
      }
      line += 8;
    }
    return Math.trunc(item_list.length / 2) + (item_list.length % 2);
  }
}
