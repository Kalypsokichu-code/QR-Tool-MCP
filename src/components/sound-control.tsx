"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useMagneticSound } from "@/hooks/use-magnetic-sound";
import { getRadius } from "@/lib/radius";
import { getSoundPreferences, updateSoundPreferences } from "@/lib/sound-utils";

const SOUND_TEST_DELAY_MS = 100;

export function SoundControl() {
  // Use static defaults during the very first render (on both server and client) to
  // ensure the HTML generated on the server matches the one used for hydration.
  // We then synchronise with any stored user preference inside useEffect.
  const [preferences, setPreferences] = useState({
    enabled: true,
    volume: 0.3,
  });
  const testSound = useMagneticSound({ soundType: "click" });

  // After the component mounts on the client, read the persisted preference from
  // localStorage (or wherever `getSoundPreferences` pulls data from) and update
  // the state. This prevents hydration errors because the first render output is
  // identical between server and client.
  useEffect(() => {
    const currentPrefs = getSoundPreferences();
    setPreferences(currentPrefs);
  }, []);

  const toggleSound = () => {
    const newPrefs = { ...preferences, enabled: !preferences.enabled };
    updateSoundPreferences(newPrefs);
    setPreferences(newPrefs);

    // Play test sound if enabling
    if (newPrefs.enabled) {
      setTimeout(() => testSound.playSound(), SOUND_TEST_DELAY_MS);
    }
  };

  return (
    <Button
      aria-label={preferences.enabled ? "Disable sounds" : "Enable sounds"}
      className={`h-8 select-none gap-1.5 ${getRadius("iconButton")} bg-background px-2.5 text-muted-foreground ring-1 ring-border ring-inset hover:bg-background hover:text-muted-foreground`}
      onClick={toggleSound}
      title={preferences.enabled ? "Disable sounds" : "Enable sounds"}
      variant="secondary"
    >
      {preferences.enabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </Button>
  );
}
