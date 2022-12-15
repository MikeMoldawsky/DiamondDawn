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
import useWindowDimensions from "hooks/useWindowDimensions";
import { getPhysicalLoopVideo } from "assets/videos";
import classNames from "classnames";

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

const TEAM = [
  {
    id: "mike",
    name: "Mike Moldawsky (Tweezers)",
    title: "Project Creator",
    Text: MikeText,
    links: {
      twitter: "https://twitter.com/tweezers0x",
      linkedin: "https://www.linkedin.com/in/mike-moldawsky-608a2098/",
    },
  },
  {
    id: "david",
    name: "David Ariew",
    title: "Artist",
    Text: DavidText,
    links: {
      twitter: "https://twitter.com/DavidAriew",
      website: "http://arievvisuals.com/",
    },
  },
  {
    id: "asaf",
    name: "Asaf Snir",
    title: "Frontend Master",
    Text: AsafText,
    links: {
      twitter: "https://twitter.com/sniirr0x",
      linkedin: "https://www.linkedin.com/in/asaf-snir-87b581b6/",
    },
  },
  {
    id: "aviva",
    name: "Aviva Moldawsky",
    title: "Diamond Art Designer",
    Text: AvivaText,
    links: {},
  },
  {
    id: "tony",
    name: "Tony Hererra",
    title: "Advisor",
    Text: TonyText,
    links: {
      twitter: "https://twitter.com/tonyherrera",
    },
  },
];

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

const TeamMember = ({ name, id, title, Text, links }) => {
  return (
    <div className="left-spaced-aligned-column team-member">
      <div className="left-top-aligned-column team-member-header">
        <div className={classNames("profile-image", id)} />
        <div>
          <div className="tagline-text">{name}</div>
          <div className="member-title">{title}</div>
        </div>
      </div>
      <AnimatedText className="text">
        <Text />
        <SocialButtons member={id} links={links} />
      </AnimatedText>
    </div>
  );
};

const AboutUsPage = () => {
  const { width } = useWindowDimensions();

  return (
    <InfoPage
      className="about-page"
      teaser={{ src: getPhysicalLoopVideo(width), overlap: "-25%" }}
    >
      <div className="left-aligned-column general text-section">
        <div className="leading-text">ABOUT US</div>
        <AboutUsText />
      </div>
      <div className="left-top-aligned-column content-section text-section our-values">
        <div className="left-top-aligned-column">
          <div className="subtitle-text">Our Core Values</div>
          <div className="tagline-text">1. Decentralization</div>
          <AnimatedText className="text">
            <DecentralizationText />
          </AnimatedText>
          <div className="tagline-text">2. Innovation</div>
          <AnimatedText className="text">
            <InnovationText />
          </AnimatedText>
          <div className="tagline-text">3. IRL Impact</div>
          <AnimatedText className="text">
            <IRLImpactText />
          </AnimatedText>
          <div className="tagline-text">4. Digital Value</div>
          <AnimatedText className="text">
            <DigitalValueText />
          </AnimatedText>
        </div>
      </div>
      <div className="left-top-aligned-column content-section team">
        <div className="subtitle-text">Our Team</div>
        <div className="team-members">
          {map(TEAM, (teamMember) => (
            <TeamMember key={`team-member-${teamMember.id}`} {...teamMember} />
          ))}
        </div>
      </div>
    </InfoPage>
  );
};

export default AboutUsPage;
