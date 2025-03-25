// Utility for providing sensory feedback (sound and vibration)

// Check if vibration is supported
const hasVibration = () => {
  return 'vibrate' in navigator;
};

// Vibrate with a pattern
export const vibrate = (pattern: number | number[], enabled: boolean = true) => {
  if (!enabled || !hasVibration()) return;
  
  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.error('Vibration error:', error);
  }
};

// Audio context for sound effects
let audioContext: AudioContext | null = null;

// Initialize audio context (must be called after user interaction)
export const initAudio = () => {
  if (audioContext) return audioContext;
  
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioContext;
  } catch (error) {
    console.error('Audio context error:', error);
    return null;
  }
};

// Play a beep sound
export const playBeep = (frequency: number = 440, duration: number = 100, enabled: boolean = true) => {
  if (!enabled) return;
  
  const context = initAudio();
  if (!context) return;
  
  try {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Fade in and out to avoid clicks
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration / 1000);
    
    oscillator.start();
    oscillator.stop(context.currentTime + duration / 1000);
  } catch (error) {
    console.error('Audio playback error:', error);
  }
};

// Play a success sound
export const playSuccess = (enabled: boolean = true) => {
  if (!enabled) return;
  
  // Play a sequence of ascending tones
  playBeep(440, 100, enabled);
  setTimeout(() => playBeep(554, 100, enabled), 100);
  setTimeout(() => playBeep(659, 200, enabled), 200);
};

// Play a failure sound
export const playFailure = (enabled: boolean = true) => {
  if (!enabled) return;
  
  // Play a sequence of descending tones
  playBeep(440, 100, enabled);
  setTimeout(() => playBeep(349, 100, enabled), 100);
  setTimeout(() => playBeep(277, 200, enabled), 200);
};

// Play a click sound
export const playClick = (enabled: boolean = true) => {
  if (!enabled) return;
  
  playBeep(880, 30, enabled);
};

// Play a power-up sound
export const playPowerUp = (enabled: boolean = true) => {
  if (!enabled) return;
  
  // Play a sequence of tones
  playBeep(523, 80, enabled);
  setTimeout(() => playBeep(659, 80, enabled), 80);
  setTimeout(() => playBeep(784, 150, enabled), 160);
};

// Provide feedback for cell marking
export const cellMarkFeedback = (isMarked: boolean, settings: { soundEnabled: boolean, vibrationEnabled: boolean }) => {
  if (isMarked) {
    playClick(settings.soundEnabled);
    vibrate(20, settings.vibrationEnabled);
  }
};

// Provide feedback for winning
export const winFeedback = (settings: { soundEnabled: boolean, vibrationEnabled: boolean }) => {
  playSuccess(settings.soundEnabled);
  vibrate([100, 50, 100, 50, 200], settings.vibrationEnabled);
};

// Provide feedback for power-up use
export const powerUpFeedback = (settings: { soundEnabled: boolean, vibrationEnabled: boolean }) => {
  playPowerUp(settings.soundEnabled);
  vibrate([50, 30, 50], settings.vibrationEnabled);
};

// Provide feedback for timer warning
export const timerWarningFeedback = (settings: { soundEnabled: boolean, vibrationEnabled: boolean }) => {
  playBeep(880, 200, settings.soundEnabled);
  vibrate(100, settings.vibrationEnabled);
};