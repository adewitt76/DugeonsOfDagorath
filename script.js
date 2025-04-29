// @ts-check
import { Stage } from './src/services/stage.js';
import { Blob } from './src/np_characters/blob.js'
import { Painter } from './src/services/painter.js';
import { generate_map } from './src/services/map_generator.js';
import { StatusBar } from './src/services/status_bar.js';
import { Console } from './src/services/console.js';
import { DIRECTION } from './src/models/cell.js';
import { CellView } from './src/services/cell_view.js';
import { Player } from './src/models/player.js';
import { Point } from './src/models/point.js';
import { TestLevel } from './src/Levels/test_level.js';

const map = generate_map();

const stage = Stage.instance;


const blob = new Blob();
let blob_distance = 7;

let show_map = false;

/** @type { number[] } */
const pine_torch_full = [1, 2, 4, 8, 0, 0, 0, 0];
/** @type { number[] } */
const lunar_torch_full = [1, 1, 1, 1, 2, 8, 0, 0];
/** @type { number[] } */
const solar_torch_full = [1, 1, 1, 1, 1, 1, 1, 1];

const test_level = TestLevel.instance;
const player = Player.initialize(new Point(0, 1), DIRECTION.south);

setInterval(() => {
  let torch = pine_torch_full;
  const painter = new Painter();

  painter.color = 'white';

  // draw map
  // function draw_solid_map_square(x, y) {
  //   for (let r = 0; r < 6; r++) {
  //     for (let c = 0; c < 8; c++) {
  //       painter.drawPixel(x + c, y + r);
  //     }
  //   }
  // }
  // function draw_map() {
  //   map.forEach((r, x) => {
  //     r.forEach((c, y) => {
  //       switch (c) {
  //         case 'FF':
  //           painter.color = 'white';
  //           draw_solid_map_square(x * 8, y * 6);
  //           break;
  //       }
  //     });
  //   })
  // }

  const players_cell = test_level.getCell(player.position.x, player.position.y);
  CellView.instance.paint(players_cell, 0, player.direction);
  StatusBar.instance.paint();
  Console.instance.paint();

  //if (show_map) draw_map();

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

