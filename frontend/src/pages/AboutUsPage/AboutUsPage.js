import React from "react";
import "./AboutUsPage.scss";
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
import InfoPage from "components/InfoPage";
import Link from "components/Links";
import AnimatedText from "components/AnimatedText";

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
        <Link href={link}>
          <SVG src={SOCIAL_ICONS[provider]} />
        </Link>
      </div>
    ))}
  </div>
);

const AboutUsPage = () => {
  return (
    <InfoPage
      className="about-page"
      teaser={{ src: "physical-loop.webm", overlap: "-25%" }}
    >
      <div className="left-aligned-column general">
        <div className="leading-text">ABOUT US</div>
        <AboutUsText />
      </div>
      <div className="left-top-aligned-column content-section our-values">
        <div className="leading-text">Our Core Values</div>
        <div className="secondary-text">1. Decentralization</div>
        <AnimatedText className="text">
          <DecentralizationText />
        </AnimatedText>
        <div className="secondary-text">2. Innovation</div>
        <AnimatedText className="text">
          <InnovationText />
        </AnimatedText>
        <div className="secondary-text">3. IRL Impact</div>
        <AnimatedText className="text">
          <IRLImpactText />
        </AnimatedText>
        <div className="secondary-text">4. Digital Value</div>
        <AnimatedText className="text">
          <DigitalValueText />
        </AnimatedText>
      </div>
      <div className="left-top-aligned-column content-section team">
        <div className="leading-text">Our Team</div>
        <div className="team-members team-members-2">
          <div className="left-spaced-aligned-column team-member">
            <div className="profile-image mike" />
            <div className="secondary-text">Mike Moldawsky (Tweezers)</div>
            <div className="member-title">Project Creator</div>
            <AnimatedText className="text">
              <MikeText />
              <SocialButtons
                member="mike"
                links={{
                  twitter: "https://twitter.com/tweezers0x",
                  linkedin:
                    "https://www.linkedin.com/in/mike-moldawsky-608a2098/",
                }}
              />
            </AnimatedText>
          </div>
          <div className="left-spaced-aligned-column team-member">
            <div className="profile-image david" />
            <div className="secondary-text">David Ariew</div>
            <div className="member-title">Artist</div>
            <AnimatedText className="text">
              <DavidText />
              <SocialButtons
                member="david"
                links={{
                  twitter: "https://twitter.com/DavidAriew",
                  website: "http://arievvisuals.com/",
                }}
              />
            </AnimatedText>
          </div>
        </div>
        <div className="team-members team-members">
          <div className="left-spaced-aligned-column team-member">
            <div className="profile-image asaf" />
            <div className="secondary-text">Asaf Snir</div>
            <div className="member-title">Frontend Master</div>
            <AnimatedText className="text">
              <AsafText />
              <SocialButtons
                member="asaf"
                links={{
                  twitter: "",
                  linkedin: "https://www.linkedin.com/in/asaf-snir-87b581b6/",
                }}
              />
            </AnimatedText>
          </div>
          <div className="left-spaced-aligned-column team-member">
            <div className="profile-image aviva" />
            <div className="secondary-text">Aviva Moldawsky</div>
            <div className="member-title">Diamond Art Designer</div>
            <AnimatedText className="text">
              <AvivaText />
              <SocialButtons member="aviva" />
            </AnimatedText>
          </div>
          <div className="left-spaced-aligned-column team-member">
            <div className="profile-image tony" />
            <div className="secondary-text">Tony Hererra</div>
            <div className="member-title">Advisor</div>
            <AnimatedText className="text">
              <TonyText />
              <SocialButtons
                member="tony"
                links={{ twitter: "https://twitter.com/tonyherrera" }}
              />
            </AnimatedText>
          </div>
        </div>
      </div>
    </InfoPage>
  );
};

export default AboutUsPage;
