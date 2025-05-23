// @ts-check
import { Game } from './src/game.js';
import { SoundGenerator } from './src/services/sound_manager.js';

const game = Game.instance;

confirm('prepare');
SoundGenerator.instance.explosion_1(1);

game.start();

