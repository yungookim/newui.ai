import { AbsoluteFill } from "remotion";
import { theme } from "../styles/theme";

export const SlideCTA: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          background: theme.colors.primary,
          borderRadius: "50%",
          filter: "blur(150px)",
          opacity: 0.2,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 80,
            fontWeight: 700,
            color: theme.colors.text,
            letterSpacing: "-0.02em",
          }}
        >
          n.codes
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 22,
            fontWeight: 400,
            color: theme.colors.textSecondary,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          Let users generate their own features in your app without waiting for your backlog to clear.
        </div>
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 20,
            fontWeight: 500,
            color: theme.colors.primary,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          It's like having a forward-deployed engineer for every user.
          <br />
          Users ask for what they need, agents build it instantly.
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 20,
              color: theme.colors.textSecondary,
            }}
          >
            Follow our journey and star
          </div>
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 22,
              color: theme.colors.primary,
              borderBottom: `2px solid ${theme.colors.primary}`,
              paddingBottom: 4,
            }}
          >
            github.com/yungookim/n.codes
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
