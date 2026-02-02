import { AbsoluteFill } from "remotion";
import { theme } from "../styles/theme";

export const SlideOutput: React.FC = () => {
  const yamlLines = [
    { text: "entities:", highlight: true },
    { text: "  user:", highlight: false },
    { text: "    fields: [id, email, name]", highlight: false },
    { text: "actions:", highlight: true },
    { text: "  createUser:", highlight: false },
    { text: "    endpoint: POST /api/users", highlight: false },
    { text: "  getUserById:", highlight: false },
    { text: "    endpoint: GET /api/users/:id", highlight: false },
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
          width: "90%",
          maxWidth: 700,
        }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 18,
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
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            lineHeight: 1.6,
            background: theme.colors.backgroundAlt,
            padding: "28px 32px",
            borderRadius: 16,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {yamlLines.map((line, index) => (
            <div
              key={index}
              style={{
                color: line.highlight
                  ? theme.colors.primary
                  : theme.colors.text,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
