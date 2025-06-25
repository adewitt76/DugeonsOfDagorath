// @ts-check
import { Creature } from "./creature";

/**
 * Moon Wizard creature - powerful magical being with moon-themed abilities
 * Stats based on WIZ0/WIZ1 from original assembly: high magic offense/defense, low physical defense
 */
export class MoonWizard extends Creature {

  constructor() {
    // WIZ0 stats: move_delay_time=13, attack_delay_time=7, magic_offense=255, 
    // magic_defense=6, physical_offense=255, physical_defense=0, hit_points=1000
    super(13, 7, 255, 6, 255, 0, 1000);
  }

  /**
   * Paint the moon wizard using the same vectors as the intro animation
   * @param {import("../services/painter").Painter} painter 
   * @param {number} distance 
   * @param {number} light_level 
   */
  paint(painter, distance, light_level) {
    painter.color = 'white';
    painter.distance = distance;
    painter.lightLevel = light_level;

    // Crescent on scepter point
    painter.moveTo(98, 46);
    painter.lineTo(100, 50);
    painter.lineTo(98, 54);
    painter.lineTo(92, 58);
    painter.lineTo(86, 56);
    painter.lineTo(82, 48);
    painter.lineTo(86, 40);
    painter.lineTo(90, 38);
    painter.lineTo(94, 40);
    painter.lineTo(92, 40);
    painter.lineTo(88, 42);
    painter.lineTo(86, 48);
    painter.lineTo(88, 52);
    painter.lineTo(92, 54);
    painter.lineTo(98, 50);
    painter.lineTo(98, 46);

    // Crescent on cape
    painter.moveTo(154, 104);
    painter.lineTo(156, 108);
    painter.lineTo(154, 112);
    painter.lineTo(148, 116);
    painter.lineTo(142, 114);
    painter.lineTo(138, 106);
    painter.lineTo(142, 98);
    painter.lineTo(146, 96);
    painter.lineTo(150, 98);
    painter.lineTo(148, 98);
    painter.lineTo(144, 100);
    painter.lineTo(142, 106);
    painter.lineTo(146, 110);
    painter.lineTo(150, 112);
    painter.lineTo(154, 108);
    painter.lineTo(154, 104);

    // Main wizard body
    painter.moveTo(124, 64);
    painter.lineTo(120, 72);
    painter.lineTo(120, 64);
    painter.lineTo(110, 78);
    painter.lineTo(102, 64);
    painter.lineTo(110, 58);
    painter.lineTo(118, 54);
    painter.lineTo(120, 50);
    painter.lineTo(122, 46);
    painter.lineTo(116, 40);
    painter.lineTo(108, 42);
    painter.lineTo(120, 28);
    painter.lineTo(126, 28);
    painter.moveTo(130, 28);
    painter.lineTo(136, 28);
    painter.lineTo(146, 36);
    painter.lineTo(148, 50);
    painter.lineTo(136, 44);
    painter.lineTo(132, 46);
    painter.lineTo(134, 48);
    painter.lineTo(136, 44);

    // Cape and scepter shaft
    painter.moveTo(48, 134);
    painter.lineTo(54, 142);
    painter.lineTo(116, 164);
    painter.lineTo(132, 132);
    painter.lineTo(130, 118);
    painter.lineTo(120, 94);
    painter.lineTo(90, 110);
    painter.lineTo(132, 132);
    painter.lineTo(72, 106);

    // Hand detail
    painter.moveTo(64, 102);
    painter.lineTo(66, 100);
    painter.lineTo(56, 94);
    painter.lineTo(54, 96);
    painter.lineTo(64, 102);

    painter.moveTo(66, 102);
    painter.lineTo(68, 98);
    painter.lineTo(74, 102);
    painter.lineTo(76, 104);
    painter.lineTo(90, 110);

    // Cape continuation
    painter.moveTo(88, 112);
    painter.lineTo(72, 120);

    // Hat
    painter.moveTo(62, 132);
    painter.lineTo(20, 128);
    painter.lineTo(52, 122);
    painter.lineTo(64, 122);
    painter.lineTo(60, 124);
    painter.lineTo(114, 128);
    painter.lineTo(80, 130);
    painter.lineTo(68, 130);
    painter.lineTo(62, 132);

    // Face detail
    painter.moveTo(40, 130);
    painter.lineTo(38, 128);
    painter.lineTo(40, 124);
    painter.lineTo(42, 126);
    painter.lineTo(40, 130);
    painter.lineTo(46, 128);
    painter.lineTo(50, 128);
    painter.lineTo(50, 126);
    painter.lineTo(42, 126);
    painter.lineTo(40, 124);
    painter.lineTo(46, 126);
  }

  /**
   * Generate mystical wizard sound effect
   */
  playSound() {
    const ctx = new AudioContext();

    // Create mystical tones inspired by moon phases
    const frequencies = [
      220.00, 261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50
    ]; // A3, C4, E4, G4, C5, E5, G5, C6 - celestial harmony progression

    const durationPerTone = 0.25; // Longer, more mystical tones
    const amplitude = 0.3; // Softer, more ethereal

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(amplitude, ctx.currentTime);
    
    // Add reverb effect for mystical atmosphere
    const convolver = ctx.createConvolver();
    const reverbBuffer = this._createReverbBuffer(ctx, 2, 44100, 0.8);
    convolver.buffer = reverbBuffer;
    
    gainNode.connect(convolver);
    convolver.connect(ctx.destination);
    gainNode.connect(ctx.destination);

    // Schedule magical tone sequence
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine'; // Pure tones for mystical effect
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      // Add slight vibrato for magical shimmer
      const vibrato = ctx.createOscillator();
      vibrato.type = 'sine';
      vibrato.frequency.setValueAtTime(5, ctx.currentTime);
      const vibratoGain = ctx.createGain();
      vibratoGain.gain.setValueAtTime(2, ctx.currentTime);
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(oscillator.frequency);
      
      oscillator.connect(gainNode);

      const startTime = ctx.currentTime + index * (durationPerTone * 0.5);
      oscillator.start(startTime);
      vibrato.start(startTime);
      oscillator.stop(startTime + durationPerTone);
      vibrato.stop(startTime + durationPerTone);
    });
  }

  /**
   * Create reverb buffer for magical atmosphere
   * @private
   */
  _createReverbBuffer(audioContext, channels, length, decay) {
    const buffer = audioContext.createBuffer(channels, length, audioContext.sampleRate);
    
    for (let channel = 0; channel < channels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    
    return buffer;
  }

  /**
   * Special magical attack - moon beam
   */
  castMoonBeam() {
    // Implementation would depend on game's magic system
    // This represents the wizard's high magic offense capability
    return {
      type: 'magic',
      damage: this._magic_offense,
      effect: 'moon_beam',
      description: 'The Moon Wizard channels lunar energy into a devastating beam!'
    };
  }

  /**
   * Special defensive ability - lunar shield
   */
  castLunarShield() {
    // Temporary boost to magic defense
    return {
      type: 'defense',
      boost: 50,
      duration: 5000, // 5 seconds
      effect: 'lunar_shield',
      description: 'The Moon Wizard surrounds himself with protective lunar energy!'
    };
  }
}