// Enhanced sound utility functions for UI interactions
type SoundOptions = {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
  playbackRate?: number;
};

type SoundPreferences = {
  enabled: boolean;
  volume: number;
};

// Type for a sound effect function
type SoundEffectFunction = (options?: SoundOptions) => Promise<void>;

// Type for the sound effects object
type SoundEffectsMap = {
  hover: SoundEffectFunction;
  click: SoundEffectFunction;
  navigate: SoundEffectFunction;
  carouselNext: SoundEffectFunction;
  carouselPrev: SoundEffectFunction;
};

const SOUND_PREFERENCES_KEY = "sound-preferences";

// Global sound preferences - can be controlled by user
let globalSoundPreferences: SoundPreferences = {
  enabled: true,
  volume: 0.3, // Lower default volume for better UX
};

// Cache for storing preloaded audio elements
const audioCache = new Map<string, HTMLAudioElement>();

// Track user interaction for autoplay compliance
let hasUserInteracted = false;

// Initialize user interaction detection
if (typeof window !== "undefined") {
  const enableAudio = () => {
    hasUserInteracted = true;
  };

  document.addEventListener("click", enableAudio, { once: true });
  document.addEventListener("keydown", enableAudio, { once: true });
  document.addEventListener("touchstart", enableAudio, { once: true });
}

/**
 * Update global sound preferences
 */
export function updateSoundPreferences(preferences: Partial<SoundPreferences>) {
  globalSoundPreferences = { ...globalSoundPreferences, ...preferences };

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(
      SOUND_PREFERENCES_KEY,
      JSON.stringify(globalSoundPreferences)
    );
  }
}

/**
 * Get current sound preferences
 */
export function getSoundPreferences(): SoundPreferences {
  // Load from localStorage on first access
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(SOUND_PREFERENCES_KEY);
    if (stored) {
      try {
        globalSoundPreferences = {
          ...globalSoundPreferences,
          ...JSON.parse(stored),
        };
      } catch (_e) {
        // Suppress JSON parsing errors for corrupt data in localStorage
      }
    }
  }
  return globalSoundPreferences;
}

/**
 * Preload an audio file with improved error handling
 */
function preloadSound(src: string): HTMLAudioElement | null {
  // Skip during SSR
  if (typeof window === "undefined") {
    return null;
  }

  const cachedAudio = audioCache.get(src);
  if (cachedAudio) {
    return cachedAudio;
  }

  try {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 0; // Start muted to avoid accidental playback

    // Add error handling
    audio.addEventListener("error", (_e) => {
      // Error handling for audio load failures
      audioCache.delete(src); // Remove failed audio from cache
    });

    // Add success handler (only log in development)
    // Use a one-time listener to avoid repeated logs on subsequent plays
    audio.addEventListener(
      "canplaythrough",
      () => {
        // Audio is ready to play
      },
      { once: true }
    );

    audioCache.set(src, audio);
    return audio;
  } catch (_error) {
    // Failed to create audio element
    return null;
  }
}

// Helper function to check if sound can be played
const canPlaySound = (preferences: SoundPreferences): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  if (!preferences.enabled) {
    return false;
  }
  if (!hasUserInteracted) {
    return false;
  }
  return true;
};

// Helper function to setup audio element properties
const setupAudioElement = (
  audio: HTMLAudioElement,
  options: SoundOptions,
  preferences: SoundPreferences
): void => {
  const finalVolume = (options.volume ?? 1) * preferences.volume;
  audio.volume = Math.min(Math.max(finalVolume, 0), 1);
  audio.loop = options.loop ?? false;
  audio.playbackRate = options.playbackRate ?? 1;

  // Reset audio to beginning if already playing
  if (!audio.paused) {
    audio.currentTime = 0;
  }
};

// Helper function to handle audio playback
const handleAudioPlayback = (
  audio: HTMLAudioElement,
  resolve: () => void,
  reject: (error: Error) => void
): void => {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => resolve())
      .catch((error) => {
        // Handle common autoplay errors gracefully
        if (error.name === "NotAllowedError") {
          // Autoplay prevented by browser
        } else {
          // Other audio playback error
        }
        reject(error);
      });
  } else {
    resolve();
  }
};

/**
 * Play a sound with enhanced options and error handling
 */
function playSound(src: string, options: SoundOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const preferences = getSoundPreferences();

    if (!canPlaySound(preferences)) {
      resolve();
      return;
    }

    // Get or create audio element
    let audio = audioCache.get(src);
    if (!audio) {
      const newAudio = preloadSound(src);
      if (!newAudio) {
        reject(new Error(`Failed to create audio for: ${src}`));
        return;
      }
      audio = newAudio;
    }

    setupAudioElement(audio, options, preferences);
    handleAudioPlayback(audio, resolve, reject);
  });
}

/**
 * Create a reusable sound effect with improved performance
 */
export function createSoundEffect(
  src: string,
  defaultOptions: SoundOptions = {}
) {
  // Skip preloading during SSR
  if (typeof window !== "undefined") {
    // Preload the sound immediately
    preloadSound(src);
  }

  return async (options: SoundOptions = {}) => {
    try {
      await playSound(src, { ...defaultOptions, ...options });
    } catch (_error) {
      // Silently handle errors to avoid disrupting UX
      // Error is intentionally swallowed for better UX
    }
  };
}

// Lazy initialization of sound effects to prevent SSR issues
let _soundEffects: SoundEffectsMap | null = null;

/**
 * Get sound effects - lazily initialized to prevent SSR issues
 */
function getSoundEffects() {
  if (_soundEffects === null) {
    _soundEffects = {
      hover: createSoundEffect("/sounds/punchy-taps.wav", { volume: 0.4 }),
      click: createSoundEffect("/sounds/click.wav", { volume: 0.5 }),

      // Navigation sounds
      navigate: createSoundEffect("/sounds/punchy-taps.wav", {
        volume: 0.3,
        playbackRate: 1.1,
      }),

      // Carousel sounds
      carouselNext: createSoundEffect("/sounds/click.wav", {
        volume: 0.4,
        playbackRate: 1.2,
      }),
      carouselPrev: createSoundEffect("/sounds/click.wav", {
        volume: 0.4,
        playbackRate: 0.9,
      }),
    };
  }
  return _soundEffects;
}

/**
 * Predefined sound effects for common UI interactions
 */
export const soundEffects = new Proxy({} as SoundEffectsMap, {
  get(_target, prop: string) {
    return getSoundEffects()[prop as keyof SoundEffectsMap];
  },
});

/**
 * Cleanup function to clear audio cache
 */
export function clearSoundCache() {
  // Skip during SSR
  if (typeof window === "undefined") {
    return;
  }

  for (const audio of audioCache.values()) {
    audio.pause();
    audio.src = "";
  }
  audioCache.clear();
}
