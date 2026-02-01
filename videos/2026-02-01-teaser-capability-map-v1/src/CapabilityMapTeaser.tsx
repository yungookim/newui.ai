import { AbsoluteFill, Sequence } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { theme, sceneStarts } from "./styles/theme";
import { HookScene } from "./scenes/HookScene";
import { PromptScene } from "./scenes/PromptScene";
import { MagicScene } from "./scenes/MagicScene";
import { ResultScene } from "./scenes/ResultScene";
import { CTAScene } from "./scenes/CTAScene";

// Load fonts
loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
loadJetBrainsMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const CapabilityMapTeaser: React.FC = () => {
  const { fps } = theme.timing;
  const premount = 1 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* Scene 1: Intro - "Introducing Capability Map" */}
      <Sequence
        from={sceneStarts.hook}
        durationInFrames={theme.timing.hook}
        premountFor={premount}
      >
        <HookScene />
      </Sequence>

      {/* Scene 2: What It Does - Maps entities, actions, queries, components */}
      <Sequence
        from={sceneStarts.prompt}
        durationInFrames={theme.timing.prompt}
        premountFor={premount}
      >
        <PromptScene />
      </Sequence>

      {/* Scene 3: How It Fits - Powers n.codes' agentic UI */}
      <Sequence
        from={sceneStarts.magic}
        durationInFrames={theme.timing.magic}
        premountFor={premount}
      >
        <MagicScene />
      </Sequence>

      {/* Scene 4: Result - YAML capability map output example */}
      <Sequence
        from={sceneStarts.result}
        durationInFrames={theme.timing.result}
        premountFor={premount}
      >
        <ResultScene />
      </Sequence>

      {/* Scene 5: CTA - Logo and GitHub URL */}
      <Sequence
        from={sceneStarts.cta}
        durationInFrames={theme.timing.cta}
        premountFor={premount}
      >
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
