import React from "react";
import "./TheJourneyPage.scss";
import { createVideoSources } from "utils";
import classNames from "classnames";
import {
  TheJourneyMainText,
  TheJourneyText,
  Phase0Text,
  Phase1Text,
  Phase2Text,
  Phase3Text,
  Phase4Text,
  Phase5Text,
} from "./TheJourneyContent";
import InfoPage from "components/InfoPage";
import AnimatedText from "components/AnimatedText";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import { useMobileOrTablet } from "hooks/useMediaQueries";
import { getPhysicalLoopVideo } from "assets/videos";
import useWindowDimensions from "hooks/useWindowDimensions";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";

const Phase = ({ className, active, title, Text, artName, artClassName }) => {
  return (
    <div className={classNames("center-aligned-row journey-row", className)}>
      <div className="image-side">
        <div className="image">
          <InlineVideo
            src={createVideoSources(artName)}
            className={artClassName}
          />
        </div>
      </div>
      <div className="text-side">
        <div className={classNames("meter", { active })} />
        <div className="tagline-text">{title}</div>
        <AnimatedText>
          <Text />
        </AnimatedText>
      </div>
    </div>
  );
};

const TheJourneyPage = () => {
  const isMobile = useMobileOrTablet();
  const { width } = useWindowDimensions();
  const { systemStage } = useSelector(systemSelector);

  return (
    <InfoPage
      className="the-journey-page"
      teaser={{ src: getPhysicalLoopVideo(width), overlap: "-22.5%" }}
    >
      <div className="text-section general">
        <div className="leading-text">THE JOURNEY</div>
        <TheJourneyMainText />
      </div>
      <div
        id="journey"
        className="center-aligned-column content-section journey"
      >
        <div
          className={classNames("center-aligned-row journey-row journey-desc", {
            "text-section": isMobile,
          })}
        >
          <AnimatedText className={classNames("text-side")}>
            <div className="subtitle-text">THE PHASES</div>
            <TheJourneyText />
          </AnimatedText>
        </div>
        <div className="journey-phases">
          <div className="scale">
            <div className="marker marker0">0.0</div>
            <div className="marker marker30">-30</div>
            <div className="marker marker60">-60</div>
            <div className="marker marker90">-90</div>
          </div>
          <Phase
            className="phase-0"
            artName="key-static"
            artClassName="key-image"
            title="Phase 0 - Mint Your Key"
            Text={Phase0Text}
            active={true}
          />
          <Phase
            className="phase-1"
            artName="rough-stone-static"
            artClassName="stone-image"
            title="Phase 1 - Enter & Mine"
            Text={Phase1Text}
            active={systemStage >= SYSTEM_STAGE.MINE}
          />
          <Phase
            className="phase-2"
            artName="question-mark"
            title="Phase 2"
            Text={Phase2Text}
            active={systemStage >= SYSTEM_STAGE.CUT}
          />
          <Phase
            className="phase-3"
            artName="question-mark"
            title="Phase 3"
            Text={Phase3Text}
            active={systemStage >= SYSTEM_STAGE.POLISH}
          />
          <Phase
            className="phase-4"
            artName="physical-digital-diamond"
            title="Phase 4 - The Final Choice"
            Text={Phase4Text}
            active={systemStage >= SYSTEM_STAGE.DAWN}
          />
          <Phase
            className="phase-5"
            artName="nft-certification"
            title="Phase 5"
            Text={Phase5Text}
            active={systemStage >= SYSTEM_STAGE.DAWN}
          />
        </div>
      </div>
    </InfoPage>
  );
};

export default TheJourneyPage;
