import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "../styles/theme";
import { CodeBlock } from "../components/CodeBlock";

export const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container entrance
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const yamlLines = [
    { text: "entities:", highlight: true },
    { text: "user:", indent: 1 },
    { text: "fields: [id, email, name]", indent: 2 },
    { text: "actions:", highlight: true },
    { text: "createUser:", indent: 1 },
    { text: "endpoint: POST /api/users", indent: 2 },
    { text: "getUserById:", indent: 1 },
    { text: "endpoint: GET /api/users/:id", indent: 2 },
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
          transform: `scale(${0.9 + containerSpring * 0.1})`,
          opacity: containerSpring,
          width: "90%",
          maxWidth: 900,
        }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 20,
            color: theme.colors.textSecondary,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: theme.colors.primary }}>{">"}</span>
          n.codes.capabilities.yaml
        </div>

        {/* YAML output */}
        <CodeBlock
          lines={yamlLines}
          startFrame={10}
          staggerFrames={5}
        />
      </div>
    </AbsoluteFill>
  );
};
