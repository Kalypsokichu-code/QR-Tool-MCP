"use client";

import { MonitorIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useMagneticSound } from "@/hooks/use-magnetic-sound";
import { getRadius } from "@/lib/radius";
import { cn } from "@/lib/utils";

function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
}: {
  icon: JSX.Element;
  value: string;
  isActive?: boolean;
  onClick: (value: string) => void;
}) {
  const clickSound = useMagneticSound({ soundType: "click" });

  const handleClick = () => {
    clickSound.playSound();
    onClick(value);
  };

  return (
    <label>
      <input
        aria-label={`Switch to ${value} theme`}
        checked={isActive}
        className="sr-only"
        onChange={() => onClick(value)}
        type="radio"
        value={value}
      />
      <button
        className={cn(
          `relative flex size-8 cursor-pointer items-center justify-center ${getRadius("iconButton")} transition-all [&_svg]:size-4`,
          isActive
            ? "text-neutral-950 dark:text-neutral-950"
            : "text-neutral-400 hover:text-neutral-950 dark:text-neutral-500 dark:hover:text-neutral-950"
        )}
        onClick={handleClick}
        type="button"
      >
        {icon}

        {isActive && (
          <motion.div
            className={`absolute inset-0 ${getRadius("iconButton")} border border-border`}
            layoutId="theme-option"
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          />
        )}
      </button>
    </label>
  );
}

const THEME_OPTIONS = [
  {
    icon: <MonitorIcon />,
    value: "system",
  },
  {
    icon: <SunIcon />,
    value: "light",
  },
  {
    icon: <MoonStarIcon />,
    value: "dark",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="flex h-8 w-24" />;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-label="Choose theme"
      className={`inline-flex items-center overflow-hidden ${getRadius("iconButton")} bg-background ring-1 ring-border ring-inset`}
      initial={{ opacity: 0 }}
      key={String(isMounted)}
      role="radiogroup"
      transition={{ duration: 0.3 }}
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          icon={option.icon}
          isActive={theme === option.value}
          key={option.value}
          onClick={setTheme}
          value={option.value}
        />
      ))}
    </motion.div>
  );
}
