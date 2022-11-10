import React, { useCallback } from "react";
import "./AboutPage.scss";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import FAQs from "components/FAQs";
import Footer from "components/Footer";
import PageSizeLimit from "components/PageSizeLimit";
import classNames from "classnames";
import ReactPlayer from "react-player";
import {
  AboutDiamondDawnText,
  TheJourneyText,
  Step0Text,
  Step1Text,
  Step2Text,
  Step3Text,
  Step4Text,
  OurTeamText,
  MikeText,
  DavidText,
  TonyText,
  AvivaText,
  AsafText,
} from "pages/AboutPage/AboutContent";
import PlayButton from "components/PlayButton";

const AboutPage = () => {
  const renderTeaserBg = useCallback(
    () => (
      <ReactPlayer
        url={getCDNVideoUrl("teaser_physical.mp4")}
        playing
        playsinline
        controls={false}
        className="react-player"
        muted
        loop
        width=""
        height=""
      />
    ),
    []
  );

  return (
    <PageSizeLimit>
      <div className="page about-page">
        <div className="bg about-background">
          <div className="bg walls" />
          <div className="bg cave" />
        </div>
        <div className="inner-page">
          <div className="general">
            <div className="leading-text">About Diamond Dawn</div>
            <AboutDiamondDawnText />
          </div>
          <div id="journey" className="center-aligned-column journey">
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
                    <img src={getCDNImageUrl("physical-digital.png")} alt="?" />
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

          <div className="left-aligned-column team">
            <div id="team" className="leading-text">
              OUR TEAM
            </div>
            <OurTeamText />
            <div className="team-members">
              <div className="team-member">
                <div className="profile-image mike" />
                <div className="secondary-text">Mike Moldawsky (Tweezers)</div>
                <div className="member-title">Project Creator</div>
                <MikeText />
              </div>
              <div className="team-member">
                <div className="profile-image david" />
                <div className="secondary-text">David Ariew</div>
                <div className="member-title">Artist</div>
                <DavidText />
              </div>
              <div className="team-member">
                <div className="profile-image" />
                <div className="secondary-text">Aviva Moldawsky</div>
                <div className="member-title">Diamond Art Designer</div>
                <AvivaText />
              </div>
              <div className="team-member">
                <div className="profile-image" />
                <div className="secondary-text">Asaf Snir</div>
                <div className="member-title">Frontend Master</div>
                <AsafText />
              </div>
              <div className="team-member">
                <div className="profile-image" />
                <div className="secondary-text">Tony Hererra</div>
                <div className="member-title">Advisor</div>
                <TonyText />
              </div>
            </div>
          </div>
          <div className="teaser">
            {renderTeaserBg()}
            <PlayButton />
          </div>
          <div className="faq">
            <div id="faq" className="leading-text">
              FAQ
            </div>
            <FAQs />
          </div>
          <Footer />
        </div>
      </div>
    </PageSizeLimit>
  );
};

export default AboutPage;
