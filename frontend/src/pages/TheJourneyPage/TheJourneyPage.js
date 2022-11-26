import React from "react";
import "./TheJourneyPage.scss";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import classNames from "classnames";
import ReactPlayer from "react-player";
import {
  TheJourneyMainText,
  TheJourneyText,
  Phase0Text,
  Phase1Text,
  Phase2Text,
  Phase3Text,
  Phase4Text,
} from "./TheJourneyContent";
import InfoPage from "components/InfoPage";
import AnimatedText from "components/AnimatedText";

const TheJourneyPage = () => {
  return (
    <InfoPage
      className="the-journey-page"
      teaser={{ src: "teaser_physical.mp4", overlap: "-25%" }}
      // withFAQ
    >
      <div className="general">
        <div className="leading-text">THE JOURNEY</div>
        <TheJourneyMainText />
      </div>
      <div
        id="journey"
        className="center-aligned-column content-section journey"
      >
        <div className="center-aligned-row journey-row journey-desc">
          <div className="image-side" />
          <AnimatedText className="text-side">
            <div className="leading-text">THE PHASES</div>
            <TheJourneyText />
          </AnimatedText>
        </div>
        <div className="journey-phases">
          <div className="scale">
            <div className="marker marker0">0.0</div>
            <div className="marker marker30">-30</div>
            <div className="marker marker60">-60</div>
            <div className="marker marker90">-90</div>
            <div className="mask" />
          </div>
          <div className="center-aligned-row journey-row phase-0">
            <div className="image-side">
              <div className="image">
                <ReactPlayer
                  url={getCDNVideoUrl("key-static.webm")}
                  playing
                  playsinline
                  controls={false}
                  muted
                  loop
                  className={classNames("react-player key-image")}
                  width=""
                  height=""
                />
              </div>
            </div>
            <div className="text-side">
              <div className="meter active" />
              <div className="secondary-text">Step 0 - Activate Your Key</div>
              <AnimatedText>
                <Phase0Text />
              </AnimatedText>
            </div>
          </div>
          <div className="center-aligned-row journey-row phase-1">
            <div className="image-side">
              <div className="image">
                <ReactPlayer
                  url={getCDNVideoUrl("rough-stone-static.webm")}
                  playing
                  playsinline
                  controls={false}
                  muted
                  loop
                  className={classNames("react-player stone-image")}
                  width=""
                  height=""
                />
              </div>
            </div>
            <div className="text-side">
              <div className="meter" />
              <div className="secondary-text">Step 1 - Enter & Mine</div>
              <AnimatedText>
                <Phase1Text />
              </AnimatedText>
            </div>
          </div>
          <div className="center-aligned-row journey-row phase-2">
            <div className="image-side">
              <div className="image">
                <img src={getCDNImageUrl("question-mark.svg")} alt="?" />
              </div>
            </div>
            <div className="text-side">
              <div className="meter" />
              <div className="secondary-text">Step 2 - ?</div>
              <AnimatedText>
                <Phase2Text />
              </AnimatedText>
            </div>
          </div>
          <div className="center-aligned-row journey-row phase-3">
            <div className="image-side">
              <div className="image">
                <img src={getCDNImageUrl("question-mark.svg")} alt="?" />
              </div>
            </div>
            <div className="text-side">
              <div className="meter" />
              <div className="secondary-text">Step 3 - ?</div>
              <AnimatedText>
                <Phase3Text />
              </AnimatedText>
            </div>
          </div>
          <div className="center-aligned-row journey-row phase-4">
            <div className="image-side">
              <div className="image">
                <img
                  src={getCDNImageUrl("/about/physical-digital.png")}
                  alt="?"
                />
              </div>
            </div>
            <div className="text-side">
              <div className="meter" />
              <div className="secondary-text">Step 4 - The Final Choice</div>
              <AnimatedText>
                <Phase4Text />
              </AnimatedText>
            </div>
          </div>
        </div>
      </div>
    </InfoPage>
  );
};

export default TheJourneyPage;
