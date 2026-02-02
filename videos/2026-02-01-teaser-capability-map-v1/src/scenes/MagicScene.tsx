import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../styles/theme";

export const MagicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flow diagram: Capability Map → n.codes → Agentic UI
  const step1Spring = spring({ frame, fps, config: { damping: 200 } });
  const step2Spring = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const step3Spring = spring({ frame: frame - 40, fps, config: { damping: 200 } });

  // Arrow animations
  const arrow1Opacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrow2Opacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
          width: "100%",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 40,
            fontWeight: 600,
            color: theme.colors.text,
            textAlign: "center",
            opacity: step1Spring,
          }}
        >
          Powers n.codes' agentic UI
        </div>

        {/* Flow diagram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {/* Step 1: Capability Map */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              opacity: step1Spring,
              transform: `scale(${0.9 + step1Spring * 0.1})`,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                background: theme.colors.backgroundAlt,
                border: `2px solid ${theme.colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
              }}
            >
              📋
            </div>
            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 22,
                fontWeight: 600,
                color: theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              Capability
              <br />
              Map
            </div>
          </div>

          {/* Arrow 1 */}
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 32,
              color: theme.colors.primary,
              opacity: arrow1Opacity,
              display: "flex",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 40,
            }}
          >
            →
          </div>

          {/* Step 2: n.codes */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              opacity: frame >= 20 ? step2Spring : 0,
              transform: `scale(${0.9 + (frame >= 20 ? step2Spring : 0) * 0.1})`,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 24,
                background: `linear-gradient(135deg, ${theme.colors.backgroundAlt}, ${theme.colors.background})`,
                border: `2px solid ${theme.colors.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 40px ${theme.colors.primaryGlow}`,
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: 28,
                  fontWeight: 700,
                  color: theme.colors.text,
                }}
              >
                n.codes
              </span>
            </div>
            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 22,
                fontWeight: 600,
                color: theme.colors.primary,
              }}
            >
              AI Engine
            </div>
          </div>

          {/* Arrow 2 */}
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 32,
              color: theme.colors.primary,
              opacity: arrow2Opacity,
              display: "flex",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 40,
            }}
          >
            →
          </div>

          {/* Step 3: Agentic UI */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              opacity: frame >= 40 ? step3Spring : 0,
              transform: `scale(${0.9 + (frame >= 40 ? step3Spring : 0) * 0.1})`,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                background: theme.colors.backgroundAlt,
                border: `2px solid ${theme.colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
              }}
            >
              ✨
            </div>
            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 22,
                fontWeight: 600,
                color: theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              Agentic
              <br />
              UI
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
