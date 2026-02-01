import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../styles/theme";

type ScanLineProps = {
  startFrame: number;
  durationFrames: number;
  direction?: "horizontal" | "vertical";
};

export const ScanLine: React.FC<ScanLineProps> = ({
  startFrame,
  durationFrames,
  direction = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0 || relativeFrame > durationFrames) {
    return null;
  }

  const progress = interpolate(
    relativeFrame,
    [0, durationFrames],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(
    relativeFrame,
    [0, durationFrames * 0.2, durationFrames * 0.8, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isHorizontal = direction === "horizontal";

  return (
    <div
      style={{
        position: "absolute",
        [isHorizontal ? "top" : "left"]: `${progress}%`,
        [isHorizontal ? "left" : "top"]: 0,
        [isHorizontal ? "right" : "bottom"]: 0,
        [isHorizontal ? "height" : "width"]: 2,
        background: `linear-gradient(${isHorizontal ? "90deg" : "180deg"},
          transparent,
          ${theme.colors.primary},
          transparent
        )`,
        opacity,
        boxShadow: `0 0 20px ${theme.colors.primary}`,
      }}
    />
  );
};
