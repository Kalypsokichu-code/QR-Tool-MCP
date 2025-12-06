"use client";

import { useCallback, useRef } from "react";
import { getSoundPreferences, soundEffects } from "@/lib/sound-utils";

type UseMagneticSoundOptions = {
  soundType?: "hover" | "click";
  enabled?: boolean;
  debounceMs?: number;
};

export function useMagneticSound(options: UseMagneticSoundOptions = {}) {
  const { soundType = "hover", enabled = true, debounceMs = 100 } = options;

  const isHoveringRef = useRef(false);
  const lastPlayTimeRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const playSound = useCallback(async () => {
    const preferences = getSoundPreferences();
    if (!(enabled && preferences.enabled)) return;

    const now = Date.now();
    if (now - lastPlayTimeRef.current < debounceMs) return;
    if (isHoveringRef.current && soundType === "hover") return;

    if (soundType === "hover") isHoveringRef.current = true;
    lastPlayTimeRef.current = now;

    try {
      await soundEffects[soundType]();
    } catch {
      // Silent for UX
    }
  }, [enabled, soundType, debounceMs]);

  const resetHoverState = useCallback(() => {
    isHoveringRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const onMouseEnter = useCallback(() => {
    playSound();
  }, [playSound]);

  const onMouseLeave = useCallback(() => {
    resetHoverState();
  }, [resetHoverState]);

  const onClick = useCallback(() => {
    resetHoverState();
    if (soundType === "click") playSound();
  }, [playSound, resetHoverState, soundType]);

  return {
    playSound,
    resetHoverState,
    onMouseEnter,
    onMouseLeave,
    onClick,
    soundProps: { onMouseEnter, onMouseLeave, onClick },
  };
}
