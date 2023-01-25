import React from "react";
import "./JourneyPhases.scss";
import { createVideoSources } from "utils";
import classNames from "classnames";
import {
  PhaseKeyText,
  PhaseRoughStoneText,
  PhaseToBeRevealedText,
  PhaseFinalText,
} from "components/JourneyPhases/JourneyPhasesContent";
import AnimatedText from "components/AnimatedText";
import InlineVideo from "components/VideoPlayer/InlineVideo";
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

const JourneyPhases = () => {
  const { systemStage } = useSelector(systemSelector);

  return (
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
        Text={PhaseKeyText}
        active={true}
      />
      <Phase
        className="phase-1"
        artName="rough-stone-static"
        artClassName="stone-image"
        title="Phase 1 - Enter & Mine"
        Text={PhaseRoughStoneText}
        active={systemStage >= SYSTEM_STAGE.MINE}
      />
      <Phase
        className="phase-2"
        artName="question-mark"
        title="Next Phases"
        Text={PhaseToBeRevealedText}
        active={
          systemStage >= SYSTEM_STAGE.MINE && systemStage < SYSTEM_STAGE.DAWN
        }
      />
      <Phase
        className="phase-5"
        artName="nft-certification"
        title="Phase 5"
        Text={PhaseFinalText}
        active={systemStage >= SYSTEM_STAGE.DAWN}
      />
    </div>
  );
};

export default JourneyPhases;
