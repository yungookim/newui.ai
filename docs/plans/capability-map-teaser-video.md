# Capability Map Teaser Video Design

**Created:** 2026-02-01
**Type:** Social Media Teaser
**Duration:** 15 seconds
**Location:** `videos/2026-02-01-teaser-capability-map-v1/`

## Overview

A fast-paced social media teaser introducing Capability Map - the foundation that powers n.codes' agentic UI. The video explains what capability maps are, what they capture, and how they enable intelligent UI generation.

**Key Message:** "Agentic UI for users" - Capability Map understands your codebase so n.codes can build intelligent UI.

**Narrative Flow:**
1. Introduce the concept (Capability Map)
2. Explain what it captures (entities, actions, queries, components)
3. Show how it powers n.codes' agentic UI
4. Demo the output format
5. Call to action

## Visual Design

### Theme (matches landing page)

- **Background:** Dark mode (`#0a0a0a` to `#1a1a1a`)
- **Primary accent:** Green (`#4ade80`)
- **Text:** White (`#ffffff`) with gray secondary (`#a1a1aa`)
- **Fonts:**
  - Headlines: Inter (bold)
  - Code/technical: JetBrains Mono

### Motion Principles

- Snappy transitions (200-300ms)
- Subtle glow effects on key elements
- No excessive animation - let content breathe
- Green accent highlights important elements

## Scene Breakdown

### Scene 1: Intro (0-3s)
**Purpose:** Introduce Capability Map

```
[Dark screen with subtle grid, background glow]
"INTRODUCING" (uppercase, green, letter-spaced)
"Capability Map" (large, white, with glow)
```

**Animations:**
- Label fades in with slight upward motion
- Title springs in with scale effect (0.9 → 1.0)
- Subtle green glow builds behind title

---

### Scene 2: What It Does (3-6s)
**Purpose:** Explain what capability maps capture

```
[Header: "Maps your codebase's capabilities"]
[2x2 grid of cards:]
  📦 Entities - Data models
  ⚡ Actions - API mutations
  🔍 Queries - Data fetching
  🧩 Components - UI building blocks
```

**Animations:**
- Header fades in with spring
- Cards stagger in (200ms between each)
- Each card slides up as it appears

---

### Scene 3: How It Fits (6-9s)
**Purpose:** Show how Capability Map powers n.codes

```
[Title: "Powers n.codes' agentic UI"]
[Flow diagram:]
  📋 Capability Map → n.codes AI Engine → ✨ Agentic UI
[Pulsing connection line]
```

**Animations:**
- Each step springs in sequentially
- Arrows fade in between steps
- Connection line pulses with green gradient

---

### Scene 4: Result (9-12s)
**Purpose:** Show the capability map output format

```
[File header: "> n.codes.capabilities.yaml"]
[YAML output:]
entities:
  user:
    fields: [id, email, name]
actions:
  createUser:
    endpoint: POST /api/users
```

**Animations:**
- Container springs in
- Lines appear sequentially (stagger 150ms)
- Green highlight on section headers

---

### Scene 5: CTA (12-15s)
**Purpose:** Drive action

```
[Clean centered layout with background glow]
"n.codes" (large logo)
"Understand any codebase instantly"
"github.com/yungookim/n.codes" (green, underlined)
```

**Animations:**
- Logo springs in
- Tagline fades up
- URL fades up last with underline

---

## Technical Specifications

### Remotion Config

```typescript
// remotion.config.ts
export const fps = 30;
export const width = 1080;  // Instagram/TikTok vertical
export const height = 1920;
export const durationInFrames = 450; // 15 seconds at 30fps
```

### Project Structure

```
videos/2026-02-01-teaser-capability-map-v1/
├── package.json
├── remotion.config.ts
├── tsconfig.json
├── src/
│   ├── Root.tsx              # Composition registration
│   ├── CapabilityMapTeaser.tsx  # Main composition
│   ├── scenes/
│   │   ├── HookScene.tsx
│   │   ├── PromptScene.tsx
│   │   ├── MagicScene.tsx
│   │   ├── ResultScene.tsx
│   │   └── CTAScene.tsx
│   ├── components/
│   │   ├── TypewriterText.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── GlowEffect.tsx
│   │   └── ScanLine.tsx
│   └── styles/
│       └── theme.ts
└── public/
    └── fonts/
```

### Shared Resources

Future videos can share common components:

```
videos/
├── shared/
│   ├── components/
│   ├── styles/
│   └── utils/
└── 2026-02-01-teaser-capability-map-v1/
```

## Frame Timing

| Scene | Start Frame | End Frame | Duration |
|-------|-------------|-----------|----------|
| Intro | 0 | 90 | 3s |
| What It Does | 90 | 180 | 3s |
| How It Fits | 180 | 270 | 3s |
| Result | 270 | 360 | 3s |
| CTA | 360 | 450 | 3s |

## Render Outputs

- **Primary:** MP4 1080x1920 (vertical for social)
- **Secondary:** MP4 1920x1080 (horizontal for website)
- **GIF:** 540x960 (compressed preview)

## Implementation Notes

1. Use `interpolate()` for all animations
2. Use `spring()` for organic motion
3. Keep bundle size small - no heavy dependencies
4. Test on both light and dark system themes
