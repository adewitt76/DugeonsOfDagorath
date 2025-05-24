// @ts-check
import { Game } from './src/game.js';
import { SoundGenerator } from './src/services/sound_manager.js';

confirm('prepare');
SoundGenerator.instance.explosion_1(1);

const game = Game.instance;
game.start();

