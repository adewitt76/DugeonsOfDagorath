// @ts-check
import { Creature } from "./creature";

//
export class Blob extends Creature {

  paint(painter, distance, light_level) {
    painter.color = 'green';
    painter.distance = distance;
    painter.lightLevel = light_level;
    // body
    painter.moveTo(130, 82);
    painter.lineToRelative(-16, 4);
    painter.lineToRelative(-6, 14);
    painter.lineToRelative(-2, 10);
    painter.lineToRelative(0, 10);
    painter.lineToRelative(-10, 10);
    painter.lineToRelative(10, -2);
    painter.lineToRelative(-2, 4);
    painter.lineToRelative(10, -6);
    painter.lineToRelative(14, 2);
    painter.lineToRelative(14, 2);
    painter.lineToRelative(6, -2);
    painter.lineToRelative(4, 4);
    painter.lineToRelative(2, -4);
    painter.lineToRelative(8, 2);
    painter.lineToRelative(-6, -6);
    painter.lineToRelative(-2, -16);
    painter.lineToRelative(-6, -16);
    painter.lineToRelative(-10, -6);
    painter.lineToRelative(-8, -4);
    // eyes
    painter.color = 'white';
    painter.moveTo(130, 86);
    painter.lineToRelative(6, 6);
    painter.lineToRelative(2, 6);
    painter.lineToRelative(-10, 2);
    painter.lineToRelative(2, -14);
    painter.lineToRelative(-10, 6);
    painter.lineToRelative(-2, 10);
    painter.lineToRelative(10, -2);
    // mouth
    painter.color = 'red';
    painter.moveTo(116, 108);
    painter.lineTo(118, 114);
    painter.lineTo(144, 120);
  }

  playSound() {
    // Create AudioContext
    const ctx = new AudioContext();

    // Frequencies from the assembly analysis (in Hz)
    const frequencies = [
      57.82, 55.75, 53.82, 52.00, 50.33, 48.75, 47.27, 45.87,
      44.56, 43.33, 42.17, 41.08, 39.97, 38.97, 38.02, 37.11
    ];

    // Duration per tone (seconds)
    const durationPerTone = 0.354 / 8; // ~0.022125 seconds

    // Amplitude (emulating m0261, 0 to 1 scale; 0.5 is moderate volume)
    const amplitude = 0.5;

    // Create GainNode for amplitude control
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(amplitude, ctx.currentTime);
    gainNode.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4000, ctx.currentTime);
    gainNode.connect(filter);
    filter.connect(ctx.destination);

    // Schedule each tone
    frequencies.forEach((freq, index) => {
      // Create OscillatorNode
      const oscillator = ctx.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      // Connect to gainNode
      oscillator.connect(gainNode);

      // Schedule start and stop times
      const startTime = ctx.currentTime + index * durationPerTone;
      oscillator.start(startTime);
      oscillator.stop(startTime + durationPerTone);
    })
  }

}

