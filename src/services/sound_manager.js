// @ts-check

const SOUND_SOURCE_ID = Object.freeze({
  torch: 'torch_sound',
  explosion_1: 'explosion_1'
});

export class SoundGenerator {

  /** @private @type { SoundGenerator } */
  static _instance;

  /** @private @type { AudioContext } */
  _audio_context;

  /** @private @type { GainNode } */
  _audio_gain;

  /** @private @type { HTMLAudioElement } */
  _torch;

  /** @private @type { HTMLAudioElement } */
  _explosion_1;

  /** @private */
  constructor() {
    // Initialize Audio Context
    this._audio_context = new AudioContext();
    this._audio_gain = this._audio_context.createGain();
    this._torch = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.torch));
    this._explosion_1 = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.explosion_1));
  }

  /** Get the singleton instance of this Object
   * @return { SoundGenerator }
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new SoundGenerator();
    return this._instance;
  }

  /** Play explosion 1 sound
   * @param { number } volume volume represented from 0 to 1.0
   */
  torch(volume) {
    this.play(this._torch, volume);
    this._torch = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.torch));
  }

  /** Play explosion 1 sound
   * @param { number } volume volume represented from 0 to 1.0
   */
  explosion_1(volume) {
    this.play(this._explosion_1, volume);
    this._explosion_1 = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.explosion_1));
  }

  /** 
   * @param { HTMLAudioElement } source 
   * @param { number } volume volume represented from 0 to 1.0
   * @private 
   */
  play(source, volume) {
    const track = this._audio_context.createMediaElementSource(source);
    track.connect(this._audio_gain).connect(this._audio_context.destination);
    this._audio_gain.gain.value = volume * 2;
    source.play();
  }
}

// Create sound library - mapping from original sound names to methods
//   this.sounds = {
//     // Creature Sounds
//     "SQK0": () => this.squeak(0x0020),     // spider
//     "RTL0": () => this.rattle(10),         // viper
//     "ROR0": () => this.growl(0x0300),      // stone giant 1
//     "BEP0": () => this.beoop(),            // blob
//     "KLK0": () => this.klank(0xaf, 0x36),  // knight 1
//     "ROR1": () => this.growl(0x0200),      // stone giant 2
//     "RTL1": () => this.pssst(2),           // scorpion
//     "KLK1": () => this.klank(0x32, 0x12),  // knight 2
//     "PSHT": () => this.pssht(1),           // wraith
//     "ROR2": () => this.snarl(0x0100),      // balrog
//     "SQK1": () => this.bdlbdl(),           // wizzard 1
//     "SQK2": () => this.bdlbdl(),           // wizzard 2
//
//     // Object Sounds
//     "FLAS": () => this.gluglg(),           // flask
//     "RING": () => this.phaser(),           // ring
//     "SCRO": () => this.whoop(0x0100),      // scroll
//     "SHIE": () => this.clang(0x64, 0x24),  // shield
//     "SWOR": () => this.whoosh(),           // sword
//     "TORC": () => this.chuck(),            // torch
//
//     // Miscellaneous Sounds
//     "KLK2": () => this.klink(),            // hit creature
//     "KLK3": () => this.clank(0x19, 0x09),  // hit player
//     "THUD": () => this.thud(),             // hit wall
//     "EXP0": () => this.bang(),             // explosion 0
//     "EXP1": () => this.kaboom()            // explosion 1
