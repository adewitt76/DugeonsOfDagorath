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
import { AnimationManager } from "./services/animation_manager";
import { IntroStatusBar } from "./services/view_intro_status_bar";
import { IntroConsole } from "./services/view_intro_console";
import { Animation } from "./animations/animation";
import { IntroAnimation } from "./animations/intro";

const GAME_STATUS = Object.freeze({
  intro: "intro",
  playing: "playing",
  game_over: "game_over"
});

export class Game {

  /** @private @type { Game } */
  static _instance;

  /** @private @type { Player }*/
  _player;

  /** @private @type { Level[] } */
  _levels;

  /** @private @type { MapView } */
  _map_view;

  /** @private @type { number } the time stamp of the last heart beat */
  _last_heart_beat_time = 0;

  /** @private @type { 'intro' | 'playing' | 'game_over' } */
  _game_status;

  /** @private @type { number } */
  _start_time;

  /** @private */
  constructor() {
    const dungeon_generator = new DungeonGenerator();
    this._levels = dungeon_generator.generateDungeon();
    const starting_position = dungeon_generator.generate_player_starting_location(this._levels[0]);
    const starting_direction = dungeon_generator.generate_player_starting_direction(starting_position, this._levels[0]);
    this._player = Player.initialize(starting_position, starting_direction);
    this._show_debug = false;
    this._map_view = new MapView();
    this._game_status = GAME_STATUS.intro;
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

  /** Get the levels for use in the components
   * @return { Level[] } the collection of levels
   */
  get levels() {
    return this._levels;
  }

  /** get the current cell of the player
    * @returns { Cell }
    */
  get players_cell() {
    return this._levels[this._player.level - 1].getCell(this._player.position.x, this._player.position.y);
  }

  /** Start the game
   * @param { number } time_stamp the time stamp given by requestAnimationFrame()
   */
  start = (time_stamp) => {
    if (!this._start_time) {
      this._start_time = time_stamp;
      AnimationManager.instance.add(new IntroAnimation());
    }
    switch (this._game_status) {
      case GAME_STATUS.intro:
        this.play_intro(time_stamp);
        break;
      case GAME_STATUS.playing:
        this.play_game(time_stamp);
        break;
    }
    requestAnimationFrame(this.start);
  }

  /** The main game loop. This relies on the browsers animation loop.
   * @param { number } time_stamp the time stamp given by requestAnimationFrame()
   * @private
   */
  play_intro = (time_stamp) => {
    // TODO: intro 20 seconds with last 5 seconds saying prepare
    // time line 5 second phase in of wizard
    // 4 seconds display 'I dare the'
    // at 10 seconds phase out wizard
    // at 15 seconds display 'prepare'
    const stage = Stage.instance;
    const painter = new Painter();
    const animation_manager = AnimationManager.instance;
    painter.color = 'white';
    if (animation_manager.has_animation) animation_manager.paint(time_stamp, 11);
    IntroStatusBar.instance.paint();
    if (time_stamp > this._start_time + 5000 && time_stamp <= this._start_time + 9000) IntroConsole.instance.paint();
    stage.swapBuffers();
    if (time_stamp > this._start_time + 21000) this._game_status = GAME_STATUS.playing;
  }

  /** The main game loop. This relies on the browsers animation loop.
   * @param { number } time_stamp the time stamp given by requestAnimationFrame()
   * @private
   */
  play_game = (time_stamp) => {
    if (document.hasFocus()) {
      this.paint_main_window(time_stamp);
      this.beat_heart(time_stamp);
      this._player.updatePlayer();
    }
  }

  /** Draw the main game canvas
    * @param { number } time_stamp 
    * @private
    */
  paint_main_window(time_stamp) {
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
        const animation_manager = AnimationManager.instance;
        if (animation_manager.has_animation) {
          animation_manager.paint(time_stamp, this._player.light_level);
        } else {
          CellView.instance.paint(this.players_cell, 0, this._player.light_level, magic_illumination, this._player.direction);
        }
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

  /** Actions to perform on a heart beat
    * @param { number } time_stamp the time stamp provided by browser animation
    * @private
    */
  beat_heart(time_stamp) {
    if ((this._last_heart_beat_time + (this._player.jiffy_score / 60)) < (time_stamp / 1000)) {
      // every heart beat show a beat and heal some of players damage
      this._last_heart_beat_time = time_stamp / 1000;
      StatusBar.instance.beat_heart();
      this._player.heal();
    }
  }

}
