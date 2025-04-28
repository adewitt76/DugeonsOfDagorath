// This has sound experments from AI at the bottom

function playCreatureSound({
  frequencies = [], // Frequencies (Hz) or 0 for noise
  durations = [], // Per-tone durations (seconds)
  pauses = [], // Pauses between tones (seconds)
  amplitude = 0.5, filterFreq = 4000, useNoise = false // Toggle noise vs. square wave
}) {
  const ctx = new AudioContext();

  // GainNode
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(amplitude, ctx.currentTime);

  // Low-pass filter
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);

  // Connect
  gainNode.connect(filter);
  filter.connect(ctx.destination);

  // Schedule
  let currentTime = ctx.currentTime;
  frequencies.forEach((freq, index) => {
    let source;
    if (useNoise) {
      // Noise burst
      const bufferSize = ctx.sampleRate * durations[index];
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // White noise
      }
      source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
    } else {
      // Square wave
      source = ctx.createOscillator();
      source.type = 'square';
      source.frequency.setValueAtTime(freq, currentTime);
    }

    source.connect(gainNode);
    const duration = durations[index] || 0.1;
    source.start(currentTime);
    source.stop(currentTime + duration);

    const pause = pauses[index] || 0;
    currentTime += duration + pause;
  });
}

