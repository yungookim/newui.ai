// Theme constants matching n.codes landing page
export const theme = {
  colors: {
    background: "#0a0a0a",
    backgroundAlt: "#1a1a1a",
    primary: "#4ade80",
    primaryGlow: "rgba(74, 222, 128, 0.3)",
    text: "#ffffff",
    textSecondary: "#a1a1aa",
    border: "#27272a",
  },
  fonts: {
    heading: "Inter",
    mono: "JetBrains Mono",
  },
  timing: {
    // Scene durations in frames (at 30fps)
    fps: 30,
    hook: 90, // 3s
    prompt: 90, // 3s
    magic: 90, // 3s
    result: 90, // 3s
    cta: 90, // 3s
    total: 450, // 15s
  },
  // Video dimensions (vertical for social)
  dimensions: {
    width: 1080,
    height: 1920,
  },
} as const;

// Scene start frames
export const sceneStarts = {
  hook: 0,
  prompt: theme.timing.hook,
  magic: theme.timing.hook + theme.timing.prompt,
  result: theme.timing.hook + theme.timing.prompt + theme.timing.magic,
  cta: theme.timing.hook + theme.timing.prompt + theme.timing.magic + theme.timing.result,
} as const;
