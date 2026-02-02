import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../styles/theme";

type CodeLine = {
  text: string;
  indent?: number;
  highlight?: boolean;
};

type CodeBlockProps = {
  lines: CodeLine[];
  startFrame: number;
  staggerFrames?: number;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  lines,
  startFrame,
  staggerFrames = 6,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: 28,
        lineHeight: 1.6,
        background: theme.colors.backgroundAlt,
        padding: "32px 40px",
        borderRadius: 16,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {lines.map((line, index) => {
        const lineStartFrame = startFrame + index * staggerFrames;
        const relativeFrame = frame - lineStartFrame;

        const opacity = interpolate(
          relativeFrame,
          [0, 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const translateY = interpolate(
          relativeFrame,
          [0, 8],
          [10, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={index}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              marginLeft: (line.indent || 0) * 24,
              color: line.highlight
                ? theme.colors.primary
                : theme.colors.text,
            }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
};
