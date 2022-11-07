import React from "react";
import "./AboutPage.scss";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import FAQs from "components/FAQs";
import Footer from "components/Footer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PageSizeLimit from "components/PageSizeLimit";
import classNames from "classnames";
import ReactPlayer from "react-player";
import {AboutDiamondDawnText, TheJourneyText, Step0Text, Step1Text, Step2Text, Step3Text, Step4Text, OurTeamText, MikeText, DavidText, TonyText, AvivaText, AsafText} from "pages/AboutPage/AboutContent";

const AboutPage = () => {
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
          <div className="center-aligned-column journey">
            <div id="journey" className="leading-text">THE JOURNEY</div>
            <TheJourneyText />
            <div className="journey-step">
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
              <div className="secondary-text">Step 0 - Activate Your Key</div>
              <Step0Text />
            </div>
            <div className="journey-step">
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
              <div className="secondary-text">Step 1 - Enter & Mine</div>
              <Step1Text />
            </div>
            <div className="journey-step">
              <div className="secondary-text">Step 2 - ?</div>
              <Step2Text />
            </div>
            <div className="journey-step">
              <div className="secondary-text">Step 3 - ?</div>
              <Step3Text />
            </div>
            <div className="journey-step">
              <div className="secondary-text">Step 4 - Final Choice</div>
              <Step4Text />
            </div>
          </div>
          <div className="center-aligned-column team">
            <div id="team" className="leading-text">
              OUR TEAM
            </div>
            <OurTeamText />
            <div className="team-members">
              <div className="team-member">
                <AccountCircleIcon />
                <div className="secondary-text">Mike Moldawsky (Tweezers)</div>
                <div className="member-title">Project Creator</div>
                <MikeText />
              </div>
              <div className="team-member">
                <AccountCircleIcon />
                <div className="secondary-text">David Ariew</div>
                <div className="member-title">Artist</div>
                <DavidText />
              </div>
              <div className="team-member">
                <AccountCircleIcon />
                <div className="secondary-text">Tony</div>
                <div className="member-title">Advisor</div>
                <TonyText />
              </div>
              <div className="team-member">
                <AccountCircleIcon />
                <div className="secondary-text">Aviva Moldawsky</div>
                <div className="member-title">Diamond Art Designer</div>
                <AvivaText />
              </div>
              <div className="team-member">
                <AccountCircleIcon />
                <div className="secondary-text">Asaf Snir</div>
                <div className="member-title">Frontend Master</div>
                <AsafText />
              </div>
            </div>
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
