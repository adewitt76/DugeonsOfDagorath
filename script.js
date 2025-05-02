// @ts-check
import { Stage } from './src/services/stage.js';
import { Blob } from './src/np_characters/blob.js'
import { Painter } from './src/services/painter.js';
import { StatusBar } from './src/services/status_bar.js';
import { Console } from './src/services/console.js';
import { Cell, DIRECTION } from './src/models/cell.js';
import { CellView } from './src/services/cell_view.js';
import { Player } from './src/models/player.js';
import { Point } from './src/models/point.js';
import { TestLevel } from './src/Levels/test_level.js';
import { DungeonGenerator } from './src/services/map_generator.js';


const level_seeds = { 1: 0x73, 2: 0xC7, 3: 0x5D, 4: 0x97, 5: 0xF3, 6: 0x13, 7: 0x87 };
const map_generator = new DungeonGenerator();
const map = map_generator.generate(level_seeds[1]);

const stage = Stage.instance;


const blob = new Blob();
let blob_distance = 7;

let show_map = false;

// new Promise((resolve) => {
//   demo();
//   resolve(undefined);
// }).then();


/** @type { number[] } */
const pine_torch_full = [1, 2, 4, 8, 0, 0, 0, 0];
/** @type { number[] } */
const lunar_torch_full = [1, 1, 1, 1, 2, 8, 0, 0];
/** @type { number[] } */
const solar_torch_full = [1, 1, 1, 1, 1, 1, 1, 1];

const test_level = TestLevel.instance;
test_level.cells = map;

//const player = Player.initialize(new Point(5, 8), DIRECTION.north);
const player = Player.initialize(new Point(0, 0), DIRECTION.east);

/** Draw a single square on the map. The map is devided into a 32x32 
  * block grid making the block 6px high and 8px wide.
  * @param { number } row The vertical location
  * @param { number } column The horizontal location
  * @param { string } color The color the cell should be painted
  * @return { void }
  */
function draw_solid_map_square(row, column, color) {
  const painter = new Painter();
  painter.color = color;
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      painter.drawPixel(column + c, row + r);
    }
  }
}

/** Draw a 32x32 square level map on a 256px x 192px screen
  * @param { Cell[][] } map The level map.
  * @return { void }
  */
function draw_map(map) {
  for (let r = 0; r < 32; r++) {
    for (let c = 0; c < 32; c++) {
      if (!map || !map[r] || !map[r][c] || map[r][c].is_empty) {
        draw_solid_map_square(r * 6, c * 8, 'white');
      } else {
        draw_solid_map_square(r * 6, c * 8, 'black');
      }
    }
  }
}

setInterval(() => {
  let torch = pine_torch_full;
  const painter = new Painter();

  painter.color = 'white';

  const players_cell = test_level.getCell(player.position.x, player.position.y);
  CellView.instance.paint(players_cell, 0, player.direction);
  StatusBar.instance.paint();
  Console.instance.paint();

  //if (show_map) draw_map();
  draw_map(map);

  stage.swapBuffers();
}, 16.67)

// the creature paint will need to be in the cell paint function
// blob.paint(painter, blob_distance, torch[blob_distance]);
// setInterval(() => {
//   // blob picture
//   blob_distance--;
//   blob_distance = blob_distance < 0 ? 7 : blob_distance;
//   const rn = Math.trunc(Math.random() * 4);
//   if (rn === 2) blob.playSound();
// }, 3000)

