import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../styles/theme";

export const PromptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container entrance
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Capability items with staggered reveal
  const capabilities = [
    { icon: "📦", label: "Entities", desc: "Data models" },
    { icon: "⚡", label: "Actions", desc: "API mutations" },
    { icon: "🔍", label: "Queries", desc: "Data fetching" },
    { icon: "🧩", label: "Components", desc: "UI building blocks" },
  ];

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
          opacity: containerSpring,
          transform: `scale(${0.95 + containerSpring * 0.05})`,
        }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 44,
            fontWeight: 600,
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          Maps your codebase's capabilities
        </div>

        {/* Capability grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            width: "100%",
            maxWidth: 800,
          }}
        >
          {capabilities.map((cap, i) => {
            const itemStart = 20 + i * 12;
            const itemOpacity = interpolate(frame, [itemStart, itemStart + 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const itemY = interpolate(frame, [itemStart, itemStart + 15], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={cap.label}
                style={{
                  background: theme.colors.backgroundAlt,
                  borderRadius: 16,
                  border: `1px solid ${theme.colors.border}`,
                  padding: "28px 24px",
                  opacity: itemOpacity,
                  transform: `translateY(${itemY}px)`,
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cap.icon}</div>
                <div
                  style={{
                    fontFamily: theme.fonts.heading,
                    fontSize: 28,
                    fontWeight: 600,
                    color: theme.colors.primary,
                    marginBottom: 4,
                  }}
                >
                  {cap.label}
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.heading,
                    fontSize: 20,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {cap.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
