// @ts-check

const SOUND_SOURCE_ID = Object.freeze({
  scroll: 'scroll',
  torch: 'torch',
  explosion_1: 'explosion_1',
  heart_1: 'heart_1',
  heart_2: 'heart_2',
});

export class SoundGenerator {

  /** @private @type { SoundGenerator } */
  static _instance;

  /** @private @type { AudioContext } */
  _audio_context;

  /** @private @type { GainNode } */
  _audio_gain;

  /** @private @type { HTMLAudioElement } */
  _scroll;

  /** @private @type { HTMLAudioElement } */
  _torch;

  /** @private @type { HTMLAudioElement } */
  _explosion_1;

  /** @private @type { HTMLAudioElement } */
  _heart_1;

  /** @private @type { HTMLAudioElement } */
  _heart_2;

  /** @private */
  constructor() {
    // Initialize Audio Context
    this._audio_context = new AudioContext();
    this._audio_gain = this._audio_context.createGain();
    this._scroll = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.scroll));
    this._torch = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.torch));
    this._explosion_1 = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.explosion_1));
    this._heart_1 = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.heart_1));
    this._heart_2 = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.heart_2));
  }

  /** Get the singleton instance of this Object
   * @return { SoundGenerator }
   */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new SoundGenerator();
    return this._instance;
  }

  /** Play scroll sound
   * @param { number } volume volume represented from 0 to 1.0
   */
  scroll(volume) {
    this.play(this._scroll, volume);
    this._scroll = /** @type { HTMLMediaElement } */ (document.getElementById(SOUND_SOURCE_ID.scroll));
  }

  /** Play torch sound
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

  heart_1() {
    const oscillator1 = this._audio_context.createOscillator();
    const oscillator2 = this._audio_context.createOscillator();
    const gainNode = this._audio_context.createGain();
    const filter = this._audio_context.createBiquadFilter();

    // Two oscillators for richer sound
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(60, this._audio_context.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(40, this._audio_context.currentTime + 0.1);

    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(80, this._audio_context.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(50, this._audio_context.currentTime + 0.1);

    // Low-pass filter for muffled effect
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this._audio_context.currentTime);

    // Envelope for thud effect
    gainNode.gain.setValueAtTime(0, this._audio_context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, this._audio_context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this._audio_context.currentTime + 0.15);

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this._audio_context.destination);

    oscillator1.start(this._audio_context.currentTime);
    oscillator2.start(this._audio_context.currentTime);
    oscillator1.stop(this._audio_context.currentTime + 0.15);
    oscillator2.stop(this._audio_context.currentTime + 0.15);
  }

  heart_2() {
    const oscillator1 = this._audio_context.createOscillator();
    const oscillator2 = this._audio_context.createOscillator();
    const gainNode = this._audio_context.createGain();
    const filter = this._audio_context.createBiquadFilter();

    // Higher pitched for the "dub" sound
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(100, this._audio_context.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(70, this._audio_context.currentTime + 0.08);

    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(120, this._audio_context.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(80, this._audio_context.currentTime + 0.08);

    // Slightly higher cutoff for brighter sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this._audio_context.currentTime);

    // Shorter, snappier envelope
    gainNode.gain.setValueAtTime(0, this._audio_context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.6, this._audio_context.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this._audio_context.currentTime + 0.1);

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this._audio_context.destination);

    oscillator1.start(this._audio_context.currentTime);
    oscillator2.start(this._audio_context.currentTime);
    oscillator1.stop(this._audio_context.currentTime + 0.1);
    oscillator2.stop(this._audio_context.currentTime + 0.1);
  }
  /** 
   * @param { HTMLAudioElement } source 
   * @param { number } volume volume represented from 0 to 1.0
   * @private 
   */
  play(source, volume) {
    const track = this._audio_context.createMediaElementSource(source);
    track.connect(this._audio_gain).connect(this._audio_context.destination);
    this._audio_gain.gain.value = volume;
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
//
