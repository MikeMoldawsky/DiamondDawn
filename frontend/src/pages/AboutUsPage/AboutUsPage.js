import React from "react";
import "./AboutUsPage.scss";
import Footer from "components/Footer";
import PageSizeLimit from "components/PageSizeLimit";
import {
  AboutUsText,
  MikeText,
  DavidText,
  TonyText,
  AvivaText,
  AsafText,
  DecentralizationText,
  InnovationText,
  IRLImpactText,
  DigitalValueText,
} from "./AboutUsPageContent";
import map from "lodash/map";
import SVG from "components/SVG";
import twitterIcon from "assets/images/twitter.svg";
import instagramIcon from "assets/images/instagram.svg";
import linkedinIcon from "assets/images/linkedin.svg";
import websiteIcon from "assets/images/website.svg";
import TeaserVideo from "components/TeaserVideo";

const SOCIAL_ICONS = {
  // twitter: getCDNImageUrl("/social/twitter.svg"),
  // instagram: getCDNImageUrl("/social/instagram.svg"),
  // linkedin: getCDNImageUrl("/social/linkedin.svg"),
  // website: getCDNImageUrl("/social/website.svg"),
  twitter: twitterIcon,
  instagram: instagramIcon,
  linkedin: linkedinIcon,
  website: websiteIcon,
};

const SocialButtons = ({ member, links }) => (
  <div className="social-buttons">
    {map(links, (link, provider) => (
      <div key={`social-${member}-${provider}`}>
        <a target="_blank" rel="noreferrer" href={link}>
          <SVG src={SOCIAL_ICONS[provider]} />
        </a>
      </div>
    ))}
  </div>
);

const AboutUsPage = () => {
  return (
    <PageSizeLimit>
      <div className="page about-page">
        <div className="inner-page">
          <div className="bg mine-background">
            <div className="bg walls" />
            <div className="bg cave" />
          </div>
          <div className="left-aligned-column general">
            <div className="leading-text">ABOUT US</div>
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
            <div className="team-members team-members-2">
              <div className="left-spaced-aligned-column team-member">
                <div className="profile-image mike" />
                <div className="secondary-text">Mike Moldawsky (Tweezers)</div>
                <div className="member-title">Project Creator</div>
                <div className="text">
                  <MikeText />
                  <SocialButtons
                    member="mike"
                    links={{ twitter: "", instagram: "", linkedin: "" }}
                  />
                </div>
              </div>
              <div className="left-spaced-aligned-column team-member">
                <div className="profile-image david" />
                <div className="secondary-text">David Ariew</div>
                <div className="member-title">Artist</div>
                <div className="text">
                  <DavidText />
                  <SocialButtons
                    member="mike"
                    links={{
                      twitter: "",
                      instagram: "",
                      linkedin: "",
                      website: "",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="team-members team-members">
              <div className="left-spaced-aligned-column team-member">
                <div className="profile-image asaf" />
                <div className="secondary-text">Asaf Snir</div>
                <div className="member-title">Frontend Master</div>
                <div className="text">
                  <AsafText />
                  <SocialButtons
                    member="mike"
                    links={{ twitter: "", linkedin: "" }}
                  />
                </div>
              </div>
              <div className="left-spaced-aligned-column team-member">
                <div className="profile-image aviva" />
                <div className="secondary-text">Aviva Moldawsky</div>
                <div className="member-title">Diamond Art Designer</div>
                <div className="text">
                  <AvivaText />
                  <SocialButtons
                    member="mike"
                    links={{ twitter: "", instagram: "", linkedin: "" }}
                  />
                </div>
              </div>
              <div className="left-spaced-aligned-column team-member">
                <div className="profile-image tony" />
                <div className="secondary-text">Tony Hererra</div>
                <div className="member-title">Advisor</div>
                <div className="text">
                  <TonyText />
                  <SocialButtons
                    member="mike"
                    links={{ twitter: "", instagram: "", linkedin: "" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <TeaserVideo src="teaser_physical.mp4" overlap />
          <Footer />
        </div>
      </div>
    </PageSizeLimit>
  );
};

export default AboutUsPage;
