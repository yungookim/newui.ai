import { Composition, Folder, Still } from "remotion";
import { CapabilityMapTeaser } from "./CapabilityMapTeaser";
import { theme } from "./styles/theme";
import { SlideIntro } from "./slides/SlideIntro";
import { SlideCapabilities } from "./slides/SlideCapabilities";
import { SlideFlow } from "./slides/SlideFlow";
import { SlideOutput } from "./slides/SlideOutput";
import { SlideValue } from "./slides/SlideValue";
import { SlideCTA } from "./slides/SlideCTA";

// X/Twitter carousel dimensions (16:9)
const SLIDE_WIDTH = 1200;
const SLIDE_HEIGHT = 675;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Video">
        {/* Main vertical video for social media */}
        <Composition
          id="CapabilityMapTeaser"
          component={CapabilityMapTeaser}
          durationInFrames={theme.timing.total}
          fps={theme.timing.fps}
          width={theme.dimensions.width}
          height={theme.dimensions.height}
        />

        {/* Horizontal version for website/presentations */}
        <Composition
          id="CapabilityMapTeaserHorizontal"
          component={CapabilityMapTeaser}
          durationInFrames={theme.timing.total}
          fps={theme.timing.fps}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Slides">
        {/* Individual slides for X carousel */}
        <Still
          id="Slide1-Intro"
          component={SlideIntro}
          width={SLIDE_WIDTH}
          height={SLIDE_HEIGHT}
        />
        <Still
          id="Slide2-Capabilities"
          component={SlideCapabilities}
          width={SLIDE_WIDTH}
          height={SLIDE_HEIGHT}
        />
        <Still
          id="Slide3-Flow"
          component={SlideFlow}
          width={SLIDE_WIDTH}
          height={SLIDE_HEIGHT}
        />
        <Still
          id="Slide4-Output"
          component={SlideOutput}
          width={SLIDE_WIDTH}
          height={SLIDE_HEIGHT}
        />
        <Still
          id="Slide5-Value"
          component={SlideValue}
          width={SLIDE_WIDTH}
          height={SLIDE_HEIGHT}
        />
        <Still
          id="Slide6-CTA"
          component={SlideCTA}
          width={SLIDE_WIDTH}
          height={SLIDE_HEIGHT}
        />
      </Folder>
    </>
  );
};
