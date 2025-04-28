// @ts-check
import { Stage } from './src/services/stage.js';
import { Blob } from './src/np_characters/blob.js'
import { Painter } from './src/services/painter.js';
import { generate_map } from './src/services/map_generator.js';
import { StatusBar } from './src/services/status_bar.js';
import { Console } from './src/services/console.js';
import { Cell, DIRECTION, WALL_TYPE } from './src/models/cell.js';
import { CellView } from './src/services/cell_view.js';

const map = generate_map();

const stage = Stage.instance;

let color = 'red';

const blob = new Blob();
let blob_distance = 7;

let show_map = false;

/** @type { number[] } */
const pine_torch_full = [1, 2, 4, 8, 0, 0, 0, 0];
/** @type { number[] } */
const lunar_torch_full = [1, 1, 1, 1, 2, 8, 0, 0];
/** @type { number[] } */
const solar_torch_full = [1, 1, 1, 1, 1, 1, 1, 1];

setInterval(() => {

  let torch = pine_torch_full;

  const painter = new Painter();
  // painter.color = color;
  // for (let y = 170; y < 180; y++) {
  //   painter.distance = 1;
  //   painter.moveTo(10, y);
  //   painter.lineToRelative(10, 0);
  // }
  //
  color = color === 'red' ? 'blue' : 'red';

  painter.color = 'white';

  // draw map
  function draw_solid_map_square(x, y) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 8; c++) {
        painter.drawPixel(x + c, y + r);
      }
    }
  }

  function draw_map() {
    map.forEach((r, x) => {
      r.forEach((c, y) => {
        switch (c) {
          case 'FF':
            painter.color = 'white';
            draw_solid_map_square(x * 8, y * 6);
            break;
        }
      });
    })
  }

  //      ^
  //      N
  //  < W  E >
  //     S
  //     v
  const cells = [
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
  ]

  ///////////////
  cells[0][0].is_empty = false;
  cells[0][0].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][0].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[0][0].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[0][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[0][0].cells[DIRECTION.south] = cells[1][0];
  cells[0][0].cells[DIRECTION.east] = cells[0][1];

  cells[0][1].is_empty = false;
  cells[0][1].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][1].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[0][1].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[0][1].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[0][1].cells[DIRECTION.east] = cells[0][2];
  cells[0][1].cells[DIRECTION.west] = cells[0][0];

  cells[0][2].is_empty = false;
  cells[0][2].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][2].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[0][2].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[0][2].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[0][2].cells[DIRECTION.south] = cells[1][2];
  cells[0][2].cells[DIRECTION.east] = cells[0][3];
  cells[0][2].cells[DIRECTION.west] = cells[0][1];

  cells[0][3].is_empty = false;
  cells[0][3].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][3].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[0][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[0][3].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[0][3].cells[DIRECTION.east] = cells[0][4];
  cells[0][3].cells[DIRECTION.west] = cells[0][2];

  cells[0][4].is_empty = false;
  cells[0][4].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[0][4].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[0][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[0][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[0][4].cells[DIRECTION.south] = cells[1][4];
  cells[0][4].cells[DIRECTION.west] = cells[0][3];

  ///////////////////////////////
  cells[1][0].is_empty = false;
  cells[1][0].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[1][0].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[1][0].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[1][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[1][0].cells[DIRECTION.north] = cells[0][0];
  cells[1][0].cells[DIRECTION.south] = cells[2][0];

  cells[1][2].is_empty = false;
  cells[1][2].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[1][2].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[1][2].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[1][2].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[1][2].cells[DIRECTION.north] = cells[0][2];
  cells[1][2].cells[DIRECTION.south] = cells[2][2];

  cells[1][4].is_empty = false;
  cells[1][4].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[1][4].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[1][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[1][4].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[1][4].cells[DIRECTION.north] = cells[0][4];
  cells[1][4].cells[DIRECTION.south] = cells[2][4];

  ///////////////////////////////
  cells[2][0].is_empty = false;
  cells[2][0].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[2][0].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[2][0].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[2][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[2][0].cells[DIRECTION.north] = cells[1][0];
  cells[2][0].cells[DIRECTION.south] = cells[3][0];
  cells[2][0].cells[DIRECTION.east] = cells[2][1];

  cells[2][1].is_empty = false;
  cells[2][1].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[2][1].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[2][1].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[2][1].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[2][1].cells[DIRECTION.east] = cells[2][2];
  cells[2][1].cells[DIRECTION.west] = cells[2][0];

  cells[2][2].is_empty = false;
  cells[2][2].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[2][2].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[2][2].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[2][2].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[2][2].cells[DIRECTION.north] = cells[1][2];
  cells[2][2].cells[DIRECTION.south] = cells[3][2];
  cells[2][2].cells[DIRECTION.east] = cells[2][3];
  cells[2][2].cells[DIRECTION.west] = cells[2][1];

  cells[2][3].is_empty = false;
  cells[2][3].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[2][3].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[2][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[2][3].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[2][3].cells[DIRECTION.east] = cells[2][4];
  cells[2][3].cells[DIRECTION.west] = cells[2][2];

  cells[2][4].is_empty = false;
  cells[2][4].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[2][4].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[2][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[2][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[2][4].cells[DIRECTION.north] = cells[1][4];
  cells[2][4].cells[DIRECTION.south] = cells[3][4];
  cells[2][4].cells[DIRECTION.west] = cells[2][3];

  ///////////////////////////////
  cells[3][0].is_empty = false;
  cells[3][0].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[3][0].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][0].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[3][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[3][0].cells[DIRECTION.north] = cells[2][0];
  cells[3][0].cells[DIRECTION.south] = cells[4][0];

  cells[3][2].is_empty = false;
  cells[3][2].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[3][2].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][2].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[3][2].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[3][2].cells[DIRECTION.north] = cells[2][2];
  cells[3][2].cells[DIRECTION.south] = cells[4][2];

  cells[3][4].is_empty = false;
  cells[3][4].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[3][4].walls[DIRECTION.south] = WALL_TYPE.open;
  cells[3][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[3][4].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[3][4].cells[DIRECTION.north] = cells[2][4];
  cells[3][4].cells[DIRECTION.south] = cells[4][4];

  /////////////////////////////////////
  cells[4][0].is_empty = false;
  cells[4][0].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][0].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][0].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[4][0].walls[DIRECTION.west] = WALL_TYPE.solid;
  cells[4][0].cells[DIRECTION.north] = cells[3][0];
  cells[4][0].cells[DIRECTION.east] = cells[4][1];

  cells[4][1].is_empty = false;
  cells[4][1].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[4][1].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][1].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[4][1].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[4][1].cells[DIRECTION.east] = cells[4][2];
  cells[4][1].cells[DIRECTION.west] = cells[4][0];

  cells[4][2].is_empty = false;
  cells[4][2].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][2].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][2].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[4][2].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[4][2].cells[DIRECTION.north] = cells[3][2];
  cells[4][2].cells[DIRECTION.east] = cells[4][3];
  cells[4][2].cells[DIRECTION.west] = cells[4][1];

  cells[4][3].is_empty = false;
  cells[4][3].walls[DIRECTION.north] = WALL_TYPE.solid;
  cells[4][3].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][3].walls[DIRECTION.east] = WALL_TYPE.open;
  cells[4][3].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[4][3].cells[DIRECTION.east] = cells[4][4];
  cells[4][3].cells[DIRECTION.west] = cells[4][2];

  cells[4][4].is_empty = false;
  cells[4][4].walls[DIRECTION.north] = WALL_TYPE.open;
  cells[4][4].walls[DIRECTION.south] = WALL_TYPE.solid;
  cells[4][4].walls[DIRECTION.east] = WALL_TYPE.solid;
  cells[4][4].walls[DIRECTION.west] = WALL_TYPE.open;
  cells[4][4].cells[DIRECTION.north] = cells[3][4];
  cells[4][4].cells[DIRECTION.west] = cells[4][3];

  const main_view = CellView.instance;
  main_view.paintCell(cells[2][0], 0, DIRECTION.north);

  // draw hallway
  // for (let distance = 7; distance >= 0; distance--) {
  //   painter.lightLevel = torch[distance];
  //   drawSolidWallRight(painter, distance)
  //   drawSolidWallLeft(painter, distance);
  //   ceiling(painter, distance);
  // }

  // blob.paint(painter, blob_distance, torch[blob_distance]);

  StatusBar.instance.paint();
  Console.instance.paint();

  if (show_map) draw_map();

  stage.swapBuffers();
}, 16.67)

// setInterval(() => {
//   // blob picture
//   blob_distance--;
//   blob_distance = blob_distance < 0 ? 7 : blob_distance;
//   const rn = Math.trunc(Math.random() * 4);
//   if (rn === 2) blob.playSound();
// }, 3000)

