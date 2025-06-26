// @ts-check
import { Painter } from "../services/painter";
import { Animation } from "./animation";
import { FONT, print_character } from "../models/font";

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

  constructor() {
    super();
    this._painter = new Painter();
    this._painter.color = 'white';
    this._buzz_audio = document.getElementById('buzz');
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
      const scrollAudio = document.getElementById('scroll');
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
        const explosionAudio = document.getElementById('explosion_1');
        if (explosionAudio) explosionAudio.play();
        this._explosion_sound_played = true;
      }
      wizardLightLevel = clampedLightLevel;
    } else if (elapsed_time < 15000) {
      // Next 5 seconds: fade out
      // Play explosion at start of fade-out
      if (elapsed_time > 10100 && !this._fadeout_explosion_played) {
        const explosionAudio = document.getElementById('explosion_1');
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

    // Store original light level and set wizard light level
    const originalLightLevel = this._painter.lightLevel;
    this._painter.lightLevel = wizardLightLevel;

    // Crescent on scepter point - part of wizard animation
    this._painter.moveTo(98, 46);
    this._painter.lineTo(100, 50);
    this._painter.lineTo(98, 54);
    this._painter.lineTo(92, 58);
    this._painter.lineTo(86, 56);
    this._painter.lineTo(82, 48);
    this._painter.lineTo(86, 40);
    this._painter.lineTo(90, 38);
    this._painter.lineTo(94, 40);
    this._painter.lineTo(92, 40);
    this._painter.lineTo(88, 42);
    this._painter.lineTo(86, 48);
    this._painter.lineTo(88, 52);
    this._painter.lineTo(92, 54);
    this._painter.lineTo(98, 50);
    this._painter.lineTo(98, 46);

    // Crescent on cape - part of wizard animation
    this._painter.moveTo(154, 104);
    this._painter.lineTo(156, 108);
    this._painter.lineTo(154, 112);
    this._painter.lineTo(148, 116);
    this._painter.lineTo(142, 114);
    this._painter.lineTo(138, 106);
    this._painter.lineTo(142, 98);
    this._painter.lineTo(146, 96);
    this._painter.lineTo(150, 98);
    this._painter.lineTo(148, 98);
    this._painter.lineTo(144, 100);
    this._painter.lineTo(142, 106);
    this._painter.lineTo(146, 110);
    this._painter.lineTo(150, 112);
    this._painter.lineTo(154, 108);
    this._painter.lineTo(154, 104);

    // Main Wizard vector list - transposed coordinates like the crescents
    // Initial wizard outline (transposed from assembly: x,y becomes y,x)
    this._painter.moveTo(124, 64);
    this._painter.lineTo(120, 72);
    this._painter.lineTo(120, 64);
    this._painter.lineTo(110, 78);
    this._painter.lineTo(102, 64);
    this._painter.lineTo(110, 58);
    this._painter.lineTo(118, 54);
    this._painter.lineTo(120, 50);
    this._painter.lineTo(122, 46);
    this._painter.lineTo(116, 40);
    this._painter.lineTo(108, 42);
    this._painter.lineTo(120, 28);
    this._painter.lineTo(126, 28);
    this._painter.moveTo(130, 28);
    this._painter.lineTo(136, 28);
    this._painter.lineTo(146, 36);
    this._painter.lineTo(148, 50);
    this._painter.lineTo(136, 44);
    this._painter.lineTo(132, 46);
    this._painter.lineTo(134, 48);
    this._painter.lineTo(136, 44);

    // Cape and scepter shaft (transposed: x,y becomes y,x)
    this._painter.moveTo(134, 48);
    this._painter.lineTo(142, 54);
    this._painter.lineTo(164, 116);
    this._painter.lineTo(132, 132);
    this._painter.lineTo(118, 130);
    this._painter.lineTo(94, 120);
    this._painter.lineTo(110, 90);
    this._painter.lineTo(132, 132);
    this._painter.lineTo(106, 72);

    // Hand detail (transposed: x,y becomes y,x)
    this._painter.moveTo(102, 64);
    this._painter.lineTo(100, 66);
    this._painter.lineTo(94, 56);
    this._painter.lineTo(96, 54);
    this._painter.lineTo(102, 64);

    this._painter.moveTo(102, 66);
    this._painter.lineTo(98, 68);
    this._painter.lineTo(102, 74);
    this._painter.lineTo(104, 76);
    this._painter.lineTo(110, 90);

    // Cape continuation (transposed: x,y becomes y,x)
    this._painter.moveTo(112, 88);
    this._painter.lineTo(120, 72);

    // Hat (transposed: x,y becomes y,x)
    this._painter.moveTo(132, 62);
    this._painter.lineTo(128, 20);
    this._painter.lineTo(122, 52);
    this._painter.lineTo(122, 64);
    this._painter.lineTo(124, 60);
    this._painter.lineTo(128, 114);
    this._painter.lineTo(130, 80);
    this._painter.lineTo(130, 68);
    this._painter.lineTo(132, 62);

    // Face detail (transposed: x,y becomes y,x)
    this._painter.moveTo(130, 40);
    this._painter.lineTo(128, 38);
    this._painter.lineTo(124, 40);
    this._painter.lineTo(126, 42);
    this._painter.lineTo(130, 40);
    this._painter.lineTo(128, 46);
    this._painter.lineTo(128, 50);
    this._painter.lineTo(126, 50);
    this._painter.lineTo(126, 42);
    this._painter.lineTo(124, 40);
    this._painter.lineTo(126, 46);

    // Restore original light level
    this._painter.lightLevel = originalLightLevel;

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
