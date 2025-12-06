const COMPONENT_RADIUS = {
  // Form elements
  input: "rounded-md",
  select: "rounded-md",
  button: "rounded-md",
  buttonSmall: "rounded-md",
  buttonLarge: "rounded-md",
  popover: "rounded-md",
  medium: "rounded-md",

  // Cards and containers
  card: "rounded-xl",
  preview: "rounded-xl",

  // Circular elements
  iconButton: "rounded-full",

  // Small elements
  small: "rounded-sm",
} as const;

export function getRadius(component: keyof typeof COMPONENT_RADIUS) {
  return COMPONENT_RADIUS[component];
}
