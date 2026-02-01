import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../styles/theme";
import { GlowEffect } from "../components/GlowEffect";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Introducing" label
  const labelOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [0, 12], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Capability Map" title
  const titleStart = 15;
  const titleSpring = spring({
    frame: frame - titleStart,
    fps,
    config: { damping: 200 },
  });
  const titleOpacity = frame >= titleStart ? titleSpring : 0;
  const titleScale = 0.9 + titleOpacity * 0.1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${theme.colors.border} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }}
      />

      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          background: theme.colors.primary,
          borderRadius: "50%",
          filter: "blur(180px)",
          opacity: 0.15 * titleOpacity,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          zIndex: 1,
        }}
      >
        {/* "Introducing" label */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 32,
            fontWeight: 500,
            color: theme.colors.primary,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
          }}
        >
          Introducing
        </div>

        {/* "Capability Map" title */}
        <GlowEffect intensity={titleOpacity * 1.2}>
          <div
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 80,
              fontWeight: 700,
              color: theme.colors.text,
              textAlign: "center",
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              lineHeight: 1.1,
            }}
          >
            Capability Map
          </div>
        </GlowEffect>
      </div>
    </AbsoluteFill>
  );
};
