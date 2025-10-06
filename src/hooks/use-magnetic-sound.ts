"use client";

import { useCallback, useRef } from "react";

import { getSoundPreferences, soundEffects } from "@/lib/sound-utils";

type UseMagneticSoundOptions = {
  soundType?: "hover" | "click" | "navigate" | "carouselNext" | "carouselPrev";
  enabled?: boolean;
  debounceMs?: number;
};

/**
 * Enhanced magnetic sound hook with improved performance and UX
 */
export function useMagneticSound(options: UseMagneticSoundOptions = {}) {
  const { soundType = "hover", enabled = true, debounceMs = 100 } = options;

  const isHoveringRef = useRef(false);
  const lastPlayTimeRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Play the magnetic sound with debouncing and hover state management
   */
  const playSound = useCallback(async () => {
    // Check if sounds are globally enabled
    const preferences = getSoundPreferences();
    if (!(enabled && preferences.enabled)) {
      return;
    }

    // Debounce rapid calls
    const now = Date.now();
    if (now - lastPlayTimeRef.current < debounceMs) {
      return;
    }

    // Prevent multiple sounds during same hover
    if (isHoveringRef.current && soundType === "hover") {
      return;
    }

    // Update state and play sound
    if (soundType === "hover") {
      isHoveringRef.current = true;
    }

    lastPlayTimeRef.current = now;

    try {
      await soundEffects[soundType]();
    } catch (_error) {
      // Silently handle errors to avoid disrupting UX
      // Error is intentionally swallowed for better UX
    }
  }, [enabled, soundType, debounceMs]);

  /**
   * Reset hover state when mouse leaves
   */
  const resetHoverState = useCallback(() => {
    isHoveringRef.current = false;

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  /**
   * Enhanced hover handler with delay option
   */
  const onMouseEnter = useCallback(
    (_event?: React.MouseEvent) => {
      playSound();
    },
    [playSound]
  );

  /**
   * Enhanced leave handler
   */
  const onMouseLeave = useCallback(
    (_event?: React.MouseEvent) => {
      resetHoverState();
    },
    [resetHoverState]
  );

  /**
   * Click handler for immediate feedback
   */
  const onClick = useCallback(
    (_event?: React.MouseEvent) => {
      // Reset hover state first
      resetHoverState();

      // Play click sound immediately
      if (soundType === "click" || soundType === "navigate") {
        playSound();
      }
    },
    [playSound, resetHoverState, soundType]
  );

  return {
    playSound,
    resetHoverState,
    onMouseEnter,
    onMouseLeave,
    onClick,
    // Convenience props for easy spreading
    soundProps: {
      onMouseEnter,
      onMouseLeave,
      onClick,
    },
  };
}

/**
 * Specialized hook for navigation elements
 */
export function useNavigationSound() {
  return useMagneticSound({ soundType: "navigate", debounceMs: 150 });
}

/**
 * Specialized hook for carousel navigation
 */
export function useCarouselSound(direction: "next" | "prev") {
  return useMagneticSound({
    soundType: direction === "next" ? "carouselNext" : "carouselPrev",
    debounceMs: 200,
  });
}
