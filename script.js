// @ts-check
import { Game } from './src/game.js';

confirm('prepare');

const game = Game.instance;
requestAnimationFrame(game.start);

