import React from "react";
import "./TheJourneyPage.scss";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import classNames from "classnames";
import ReactPlayer from "react-player";
import {
  TheJourneyMainText,
  TheJourneyText,
  Step0Text,
  Step1Text,
  Step2Text,
  Step3Text,
  Step4Text,
} from "./TheJourneyContent";
import InfoPage from "components/InfoPage";

const TheJourneyPage = () => {
  return (
    <InfoPage className="the-journey-page" teaser={{ src: "teaser_physical.mp4", overlap: true }} withFAQ>
      <div className="general">
        <div className="leading-text">About Diamond Dawn</div>
        <TheJourneyMainText />
      </div>
      <div id="journey" className="center-aligned-column content-section journey">
        <div className="center-aligned-row journey-row journey-desc">
          <div className="image-side" />
          <div className="text-side">
            <div className="leading-text">THE JOURNEY</div>
            <TheJourneyText />
          </div>
        </div>
        <div className="journey-steps">
          <div className="scale">
            <div className="marker marker0">0.0</div>
            <div className="marker marker30">-30</div>
            <div className="marker marker60">-60</div>
            <div className="marker marker90">-90</div>
            <div className="mask" />
          </div>
          <div className="center-aligned-row journey-row step-0">
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
              <div className="secondary-text">
                Step 0 - Activate Your Key
              </div>
              <Step0Text />
            </div>
          </div>
          <div className="center-aligned-row journey-row step-1">
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
              <Step1Text />
            </div>
          </div>
          <div className="center-aligned-row journey-row step-2">
            <div className="image-side">
              <div className="image">
                <img src={getCDNImageUrl("question-mark.svg")} alt="?" />
              </div>
            </div>
            <div className="text-side">
              <div className="meter" />
              <div className="secondary-text">Step 2 - ?</div>
              <Step2Text />
            </div>
          </div>
          <div className="center-aligned-row journey-row step-3">
            <div className="image-side">
              <div className="image">
                <img src={getCDNImageUrl("question-mark.svg")} alt="?" />
              </div>
            </div>
            <div className="text-side">
              <div className="meter" />
              <div className="secondary-text">Step 3 - ?</div>
              <Step3Text />
            </div>
          </div>
          <div className="center-aligned-row journey-row step-4">
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
              <div className="secondary-text">
                Step 4 - The Final Choice
              </div>
              <Step4Text />
            </div>
          </div>
        </div>
      </div>
    </InfoPage>
  )
};

export default TheJourneyPage;
