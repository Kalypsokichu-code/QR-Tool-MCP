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

const SOUND_PREFERENCES_KEY = "sound-preferences";

let globalSoundPreferences: SoundPreferences = {
  enabled: true,
  volume: 0.3,
};

const audioCache = new Map<string, HTMLAudioElement>();
let hasUserInteracted = false;

if (typeof window !== "undefined") {
  const enableAudio = () => {
    hasUserInteracted = true;
  };
  document.addEventListener("click", enableAudio, { once: true });
  document.addEventListener("keydown", enableAudio, { once: true });
  document.addEventListener("touchstart", enableAudio, { once: true });
}

export function updateSoundPreferences(preferences: Partial<SoundPreferences>) {
  globalSoundPreferences = { ...globalSoundPreferences, ...preferences };
  if (typeof window !== "undefined") {
    localStorage.setItem(
      SOUND_PREFERENCES_KEY,
      JSON.stringify(globalSoundPreferences),
    );
  }
}

export function getSoundPreferences(): SoundPreferences {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(SOUND_PREFERENCES_KEY);
    if (stored) {
      try {
        globalSoundPreferences = {
          ...globalSoundPreferences,
          ...JSON.parse(stored),
        };
      } catch {
        // Ignore corrupt localStorage data
      }
    }
  }
  return globalSoundPreferences;
}

function preloadSound(src: string): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  const cached = audioCache.get(src);
  if (cached) return cached;

  try {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 0;
    audio.addEventListener("error", () => audioCache.delete(src));
    audioCache.set(src, audio);
    return audio;
  } catch {
    return null;
  }
}

function playSound(src: string, options: SoundOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const preferences = getSoundPreferences();

    if (
      typeof window === "undefined" ||
      !preferences.enabled ||
      !hasUserInteracted
    ) {
      resolve();
      return;
    }

    let audio = audioCache.get(src);
    if (!audio) {
      const newAudio = preloadSound(src);
      if (!newAudio) {
        reject(new Error(`Failed to create audio for: ${src}`));
        return;
      }
      audio = newAudio;
    }

    const finalVolume = (options.volume ?? 1) * preferences.volume;
    audio.volume = Math.min(Math.max(finalVolume, 0), 1);
    audio.loop = options.loop ?? false;
    audio.playbackRate = options.playbackRate ?? 1;

    if (!audio.paused) audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.then(resolve).catch(reject);
    } else {
      resolve();
    }
  });
}

export function createSoundEffect(
  src: string,
  defaultOptions: SoundOptions = {},
) {
  if (typeof window !== "undefined") preloadSound(src);

  return async (options: SoundOptions = {}) => {
    try {
      await playSound(src, { ...defaultOptions, ...options });
    } catch {
      // Silently handle for UX
    }
  };
}

type SoundEffectsMap = {
  hover: ReturnType<typeof createSoundEffect>;
  click: ReturnType<typeof createSoundEffect>;
};

let _soundEffects: SoundEffectsMap | null = null;

function getSoundEffects(): SoundEffectsMap {
  if (!_soundEffects) {
    _soundEffects = {
      hover: createSoundEffect("/sounds/punchy-taps.wav", { volume: 0.4 }),
      click: createSoundEffect("/sounds/click.wav", { volume: 0.5 }),
    };
  }
  return _soundEffects;
}

export const soundEffects = new Proxy({} as SoundEffectsMap, {
  get(_target, prop: string) {
    return getSoundEffects()[prop as keyof SoundEffectsMap];
  },
});
