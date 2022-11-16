import React, { useCallback } from "react";
import "./AboutUsPage.scss";
import { getCDNVideoUrl } from "utils";
import FAQs from "components/FAQs";
import Footer from "components/Footer";
import PageSizeLimit from "components/PageSizeLimit";
import classNames from "classnames";
import ReactPlayer from "react-player";
import {
  AboutUsText,
  MikeText,
  DavidText,
  TonyText,
  AvivaText,
  AsafText, DecentralizationText, InnovationText, IRLImpactText, DigitalValueText,
} from "./AboutUsPageContent";
import PlayButton from "components/PlayButton";

const AboutUsPage = () => {
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
        <div className="bg mine-background">
          <div className="bg walls" />
          <div className="bg cave" />
        </div>
        <div className="inner-page">
          <div className="left-aligned-column general">
            <div className="leading-text">
              ABOUT US
            </div>
            <AboutUsText />
          </div>
          <div className="left-top-aligned-column our-values">
            <div className="leading-text">Our Core Values</div>
            <div className="secondary-text">1. Decentralization</div>
            <DecentralizationText />
            <div className="secondary-text">2. Innovation</div>
            <InnovationText />
            <div className="secondary-text">3. IRL Impact</div>
            <IRLImpactText />
            <div className="secondary-text">4. Digital Value</div>
            <DigitalValueText />
          </div>
          <div className="left-top-aligned-column team">
            <div className="leading-text">Our Team</div>
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
                <div className="secondary-text">Asaf Snir</div>
                <div className="member-title">Frontend Master</div>
                <AsafText />
              </div>
            </div>
            <div className="team-members team-members-2">
              <div className="team-member">
                <div className="profile-image" />
                <div className="secondary-text">Aviva Moldawsky</div>
                <div className="member-title">Diamond Art Designer</div>
                <AvivaText />
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
          <Footer />
        </div>
      </div>
    </PageSizeLimit>
  );
};

export default AboutUsPage;
