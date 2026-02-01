import { AbsoluteFill } from "remotion";
import { theme } from "../styles/theme";

export const SlideFlow: React.FC = () => {
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
          gap: 48,
          width: "100%",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 36,
            fontWeight: 600,
            color: theme.colors.text,
            textAlign: "center",
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
            gap: 24,
          }}
        >
          {/* Step 1: Capability Map */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: theme.colors.backgroundAlt,
                border: `2px solid ${theme.colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}
            >
              📋
            </div>
            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 18,
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
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
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
                  fontSize: 22,
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
                fontSize: 18,
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
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: theme.colors.backgroundAlt,
                border: `2px solid ${theme.colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}
            >
              ✨
            </div>
            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 18,
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
