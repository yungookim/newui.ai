import { AbsoluteFill } from "remotion";
import { theme } from "../styles/theme";

export const SlideIntro: React.FC = () => {
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
          opacity: 0.15,
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
        {/* Project name */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 36,
            fontWeight: 700,
            color: theme.colors.text,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          n.codes
        </div>

        {/* "Introducing" label */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 24,
            fontWeight: 500,
            color: theme.colors.primary,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          Introducing
        </div>

        {/* "Capability Map" title */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 72,
            fontWeight: 700,
            color: theme.colors.text,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Capability Map
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 24,
            color: theme.colors.textSecondary,
            marginTop: 16,
          }}
        >
          The foundation for agentic UI
        </div>
      </div>
    </AbsoluteFill>
  );
};
