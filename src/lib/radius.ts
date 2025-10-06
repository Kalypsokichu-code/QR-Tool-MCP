/**
 * Centralized Border Radius Configuration
 *
 * This file contains all border radius values used throughout the application.
 * Modify these values to change the overall border radius theme.
 */

// Base radius values (in rem - matches CSS variables)
export const RADIUS_VALUES = {
  none: "0",
  xs: "0.125rem", // 2px
  sm: "0.25rem", // 4px
  base: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.25rem", // 20px
  "3xl": "1.5rem", // 24px
  full: "9999px", // Perfect circle
} as const;

// Consolidated 3-Tier Radius System + Special Cases
//
// TIER 1 - SUBTLE (rounded-md/6px): Interactive elements, form controls, small UI
// TIER 2 - MODERATE (rounded-xl/16px): Cards, containers, content areas
// TIER 3 - PROMINENT (rounded-2xl/20px): Major containers, dialogs, modals
// SPECIAL - rounded-full: Perfect circles, rounded-sm: Micro-elements only when needed

export const COMPONENT_RADIUS = {
  // TIER 1 - SUBTLE (rounded-md/6px)
  // Form elements
  input: "rounded-md",
  select: "rounded-md",
  textarea: "rounded-md",
  button: "rounded-md",
  buttonSmall: "rounded-md",
  buttonLarge: "rounded-md",
  popover: "rounded-md",
  tooltip: "rounded-md",
  badge: "rounded-md",
  navItem: "rounded-md",
  tab: "rounded-md",
  breadcrumb: "rounded-md",
  notification: "rounded-md",
  commandMenu: "rounded-md",
  codeBlock: "rounded-md",
  medium: "rounded-md",

  // TIER 2 - MODERATE (rounded-xl/16px)
  // Cards, containers, content areas
  card: "rounded-xl",
  toolCard: "rounded-xl",
  toolContainer: "rounded-xl", // promoted from lg
  dropzone: "rounded-xl",
  image: "rounded-xl", // promoted from lg
  video: "rounded-xl", // promoted from lg
  preview: "rounded-xl", // promoted from lg
  alert: "rounded-xl", // promoted from lg
  large: "rounded-xl", // was lg, now xl
  xlarge: "rounded-xl",

  // TIER 3 - PROMINENT (rounded-2xl/20px)
  // Major containers, dialogs, modals
  dialog: "rounded-2xl",
  modal: "rounded-2xl",
  table: "rounded-2xl",
  dataTable: "rounded-2xl",
  videoLarge: "rounded-2xl",
  overlay: "rounded-2xl",
  xxlarge: "rounded-2xl",

  // SPECIAL CASES
  // Perfect circles
  radio: "rounded-full",
  iconButton: "rounded-full",
  fab: "rounded-full",
  tag: "rounded-full",
  avatar: "rounded-full",
  progress: "rounded-full",

  // Micro-elements (use sparingly)
  checkbox: "rounded-sm",
  tooltipArrow: "rounded-sm",
  small: "rounded-sm",

  // Legacy support (maps to new tiers)
  inlineCode: "rounded-md", // was rounded, now maps to subtle tier
  statsTag: "rounded-md", // was rounded, now maps to subtle tier
} as const;

// Utility functions for dynamic radius calculation
export function getRadius(
  component: keyof typeof COMPONENT_RADIUS
): RadiusClass {
  return COMPONENT_RADIUS[component];
}

export function getRadiusValue(size: keyof typeof RADIUS_VALUES): string {
  return RADIUS_VALUES[size];
}

// For conditional radius based on size/state
export function getConditionalRadius(options: {
  base?: keyof typeof COMPONENT_RADIUS;
  small?: keyof typeof COMPONENT_RADIUS;
  large?: keyof typeof COMPONENT_RADIUS;
  isSmall?: boolean;
  isLarge?: boolean;
}): string {
  const { base = "medium", small, large, isSmall, isLarge } = options;

  if (isLarge && large) {
    return COMPONENT_RADIUS[large];
  }
  if (isSmall && small) {
    return COMPONENT_RADIUS[small];
  }
  return COMPONENT_RADIUS[base];
}

// Helper to extract radius suffix for corner-specific classes
const radiusSuffix = (key: keyof typeof COMPONENT_RADIUS) =>
  COMPONENT_RADIUS[key].replace("rounded-", "");

// Corner-specific radius (for asymmetric designs)
export const CORNER_RADIUS = {
  topLeft: (radius: keyof typeof COMPONENT_RADIUS) =>
    `rounded-tl-${radiusSuffix(radius)}`,
  topRight: (radius: keyof typeof COMPONENT_RADIUS) =>
    `rounded-tr-${radiusSuffix(radius)}`,
  bottomLeft: (radius: keyof typeof COMPONENT_RADIUS) =>
    `rounded-bl-${radiusSuffix(radius)}`,
  bottomRight: (radius: keyof typeof COMPONENT_RADIUS) =>
    `rounded-br-${radiusSuffix(radius)}`,
  top: (radius: keyof typeof COMPONENT_RADIUS) =>
    `rounded-t-${radiusSuffix(radius)}`,
  bottom: (radius: keyof typeof COMPONENT_RADIUS) =>
    `rounded-b-${radiusSuffix(radius)}`,
  left: (radius: keyof typeof COMPONENT_RADIUS) =>
    `rounded-l-${radiusSuffix(radius)}`,
  right: (radius: keyof typeof COMPONENT_RADIUS) =>
    `rounded-r-${radiusSuffix(radius)}`,
} as const;

// Semantic radius tier helpers for new components
export const RADIUS_TIERS = {
  subtle: "rounded-md", // TIER 1: Form controls, interactive elements
  moderate: "rounded-xl", // TIER 2: Cards, containers, content areas
  prominent: "rounded-2xl", // TIER 3: Major containers, dialogs, modals
  circle: "rounded-full", // SPECIAL: Perfect circles
  micro: "rounded-sm", // SPECIAL: Micro-elements (use sparingly)
} as const;

/**
 * Get radius for new components using semantic tiers
 * Use this for new components instead of hardcoding values
 */
export function getRadiusTier(tier: keyof typeof RADIUS_TIERS): string {
  return RADIUS_TIERS[tier];
}

/**
 * Squircle integration options
 */
export type SquircleOptions = {
  /** Corner smoothing intensity (0-1, where 1 is maximum smoothing) */
  cornerSmoothing?: number;
  /** Preserve smoothing at larger corner radii */
  preserveSmoothing?: boolean;
};

/**
 * Enhanced radius configuration with squircle support
 */
export type RadiusConfig = {
  /** Standard border radius class */
  standard: string;
  /** Squircle options when enabled */
  squircle?: SquircleOptions;
};

/**
 * Get enhanced radius configuration for a component
 */
export function getRadiusConfig(component: ComponentRadius): RadiusConfig {
  const standard = COMPONENT_RADIUS[component];

  // Map components to appropriate squircle settings - using 0.6 as standard
  const squircleConfig: SquircleOptions = (() => {
    // Use 0.6 smoothing for almost all components (preferred smoothing)
    if (
      ["radio", "iconButton", "fab", "tag", "avatar", "progress"].includes(
        component
      )
    ) {
      return { cornerSmoothing: 0.9, preserveSmoothing: true }; // Maximum for circular elements
    }
    // All other components use the preferred 0.6 smoothing
    return { cornerSmoothing: 0.6, preserveSmoothing: true }; // Default 0.6 smoothing
  })();

  return {
    standard,
    squircle: squircleConfig,
  };
}

/**
 * Quick helper to determine appropriate tier based on component purpose
 */
export function getSemanticRadius(
  purpose:
    | "interactive" // buttons, inputs, badges
    | "container" // cards, content areas
    | "modal" // dialogs, overlays
    | "circle" // avatars, icons
    | "micro" // tiny elements
): string {
  if (purpose === "interactive") {
    return RADIUS_TIERS.subtle;
  }
  if (purpose === "container") {
    return RADIUS_TIERS.moderate;
  }
  if (purpose === "modal") {
    return RADIUS_TIERS.prominent;
  }
  if (purpose === "circle") {
    return RADIUS_TIERS.circle;
  }
  if (purpose === "micro") {
    return RADIUS_TIERS.micro;
  }
  return RADIUS_TIERS.subtle;
}

// Type exports for better TypeScript support
export type RadiusSize = keyof typeof RADIUS_VALUES;
export type ComponentRadius = keyof typeof COMPONENT_RADIUS;
export type RadiusClass = (typeof COMPONENT_RADIUS)[ComponentRadius];
export type RadiusTier = keyof typeof RADIUS_TIERS;
