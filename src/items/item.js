// @ts-check

export const ITEM_CLASS = Object.freeze({
  flask: 'flask',
  ring: 'ring',
  scroll: 'scroll',
  shield: 'shield',
  sword: 'sword',
  torch: 'torch'
});

export class Item {
  /** @private @type { 'flask' | 'ring' | 'scroll' | 'shield' | 'sword' | 'torch' } */
  _class_name;

  /** @private @type { string } */
  _subclass;

  /** @private @type { boolean } */
  _revealed;

  /** Create a new Item
    * @param { 'flask' | 'ring' | 'scroll' | 'shield' | 'sword' | 'torch' } class_name
    * @param { string } subclass
    * @param { boolean } revealed
    */
  constructor(class_name, subclass, revealed) {
    this._class_name = class_name;
    this._subclass = subclass;
    this._revealed = revealed;
  }

  /** use this item 
    * @param { 'left' | 'right' } hand
    */
  use(hand) {
    throw new Error('Not Implemented');
  }

  /** @return { string } */
  get class_name() { return this._class_name; }
  toString() {
    return (this._revealed ? `${this._subclass} ` : '') + this._class_name;
  }
}
