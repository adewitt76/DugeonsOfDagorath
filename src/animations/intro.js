// @ts-check
import { Painter } from "../services/painter";
import { Animation } from "./animation";
import { print_character } from "../models/font";
import { MoonWizard } from "../creatures/moon_wizard";

export class IntroAnimation extends Animation {

  /** @private @type { number } */
  _start_time;

  /** @private @type { Painter } */
  _painter;

  _animation_length = 20000;

  /** @private @type { boolean } */
  _wizard_sound_played = false;

  /** @private @type { boolean } */
  _explosion_sound_played = false;

  /** @private @type { boolean } */
  _fadeout_explosion_played = false;

  /** @private @type { HTMLAudioElement } */
  _buzz_audio;

  /** @private @type { MoonWizard } */
  _moon_wizard;

  constructor() {
    super();
    this._painter = new Painter();
    this._painter.color = 'white';
    this._buzz_audio = /** @type {HTMLAudioElement}*/(document.getElementById('buzz'));
    this._moon_wizard = new MoonWizard();
  }

  /** @param { number } af_time_stamp Animation frames time stamp
    * @param { number } light_level The players light level
    */
  draw(af_time_stamp, light_level) {
    this._painter.lightLevel = light_level;
    this._painter.color = 'white';
    this._painter.distance = 1;
    if (!this._start_time) this._start_time = af_time_stamp;
    if (af_time_stamp > (this._start_time + this._animation_length)) {
      // Clean up buzz sound when animation completes
      if (this._buzz_audio && !this._buzz_audio.paused) {
        this._buzz_audio.pause();
        this._buzz_audio.currentTime = 0;
      }
      this._complete = true;
      return;
    }
    const elapsed_time = af_time_stamp - this._start_time;
    const elapsed_percentage = elapsed_time / this._animation_length;

    // Play wizard sound at start of fade-in (BDLBDL from assembly)
    if (elapsed_time > 100 && !this._wizard_sound_played) {
      const scrollAudio = /** @type {HTMLAudioElement}*/(document.getElementById('scroll'));
      if (scrollAudio) scrollAudio.play();
      this._wizard_sound_played = true;
    }

    // Beam-in effect using light levels: 5s fade-in, 5s full light, 5s fade-out, 5s remaining
    // Ensure light_level is within valid bounds (0-13)
    const clampedLightLevel = Math.max(0, Math.min(13, light_level));
    let wizardLightLevel = clampedLightLevel;

    if (elapsed_time < 5000) {
      // First 5 seconds: fade in
      wizardLightLevel = Math.floor((elapsed_time / 5000) * clampedLightLevel);
    } else if (elapsed_time < 10000) {
      // Next 5 seconds: full light
      // Play explosion when wizard is fully faded in
      if (elapsed_time > 5100 && !this._explosion_sound_played) {
        const explosionAudio = /** @type {HTMLAudioElement}*/(document.getElementById('explosion_1'));
        if (explosionAudio) explosionAudio.play();
        this._explosion_sound_played = true;
      }
      wizardLightLevel = clampedLightLevel;
    } else if (elapsed_time < 15000) {
      // Next 5 seconds: fade out
      // Play explosion at start of fade-out
      if (elapsed_time > 10100 && !this._fadeout_explosion_played) {
        const explosionAudio = /** @type {HTMLAudioElement}*/(document.getElementById('explosion_1'));
        if (explosionAudio) explosionAudio.play();
        this._fadeout_explosion_played = true;
      }
      wizardLightLevel = Math.floor(((15000 - elapsed_time) / 5000) * clampedLightLevel);
    } else {
      // Final 5 seconds: complete darkness
      wizardLightLevel = 0;
    }

    // Ensure wizard light level is within valid bounds (0-13)
    wizardLightLevel = Math.max(0, Math.min(13, wizardLightLevel));

    // Control buzz sound - only during fade-in and fade-out, not at full light
    if ((elapsed_time > 500 && elapsed_time < 5000) || (elapsed_time >= 10000 && elapsed_time < 15000)) {
      if (this._buzz_audio) {
        if (this._buzz_audio.paused) {
          this._buzz_audio.loop = true;
          this._buzz_audio.play();
        }
        // Fade buzz volume with wizard light level
        const maxVolume = 0.4;
        this._buzz_audio.volume = (wizardLightLevel / 13) * maxVolume;
      }
    } else {
      // Stop buzz sound during full light (5-10s) and final phase (15s+)
      if (this._buzz_audio && !this._buzz_audio.paused) {
        this._buzz_audio.pause();
        this._buzz_audio.currentTime = 0;
      }
    }

    // Paint the wizard using MoonWizard's paint method
    this._moon_wizard.paint(this._painter, 1, wizardLightLevel);

    // Display "Prepare!" text during final 5 seconds
    if (elapsed_time >= 15000) {
      // Center "PREPARE!" on screen (8 characters * 6 pixels wide = 48 pixels, center at 128-24=104)
      const text = "PREPARE!";
      const startX = 98; // Centered horizontally (moved left)
      const startY = 86; // Centered vertically (moved up)

      for (let i = 0; i < text.length; i++) {
        print_character(text[i], startX + (i * 6), startY, false);
      }
    }

  }

}
