import React from "react";
import "./MemberList.scss";
import map from "lodash/map";
import Link from "components/Links";
import classNames from "classnames";
import {getCDNImageUrl, getCommunityCDNUrl} from "utils";
import Emoji from "components/Emoji";

const GROUPS = {
  "Core Members": [
    {
      id: "mike",
      title: "Project Creator",
      name: "Mike Moldawsky",
      link: "https://twitter.com/tweezers0x",
    },
    {
      id: "david",
      title: "Artist",
      name: "David Ariew",
      link: "https://twitter.com/DavidAriew",
    },
    {
      id: "asaf",
      title: "Frontend Master",
      name: "Asaf Snir",
      link: "https://www.linkedin.com/in/asaf-snir-87b581b6/",
    },
    {
      id: "aviva",
      title: "Designer",
      name: "Aviva Moldawsky",
      link: "https://www.linkedin.com/in/aviva-moldawsky-12589315/",
    },
    {
      id: "tony",
      title: "Advisor",
      name: "Tony Herrera",
      link: "https://twitter.com/tonyherrera",
    },
  ],
  "Honorary Members": [
    {
      id: "daniel",
      title: "Advisor",
      name: "Daniel Moldawsky",
      link: "https://twitter.com/DanielMoldawsky",
    },
    {
      id: "abel",
      title: "Sound Wizard",
      name: "Abel Okugawa",
      link: "https://twitter.com/Abel_Okugawa",
    },
    {
      id: "danny",
      title: "Community Leader",
      name: "Danny",
      link: "https://twitter.com/BrainEmojis",
    },
    {
      id: "coy",
      title: "Community Wizard",
      name: "The Digital Coy",
      link: "https://twitter.com/TheDigitalCoy",
    },
  ],
  "Trusted Members": [
    {
      id: "gals",
      title: "Marketing",
      name: "Gal Shriki",
      link: "https://twitter.com/Shrikmeister",
    },
    {
      id: "galk",
      title: "Smart Contracts",
      name: "Gal Kleinman",
      link: "https://www.linkedin.com/in/gal-kleinman-16898384/",
    },
    {
      id: "alan",
      title: "Smart Contracts Audit",
      name: "Alan Boothe",
      link: "https://twitter.com/ltsCuzzo",
    },
  ],
  "Community Members": [
    { id: "yanay", title: "Web Designer", name: "Yanay Halevy", link: "" },
    { id: "mor", title: "Project Manager", name: "Mor Lupa", link: "" },
    {
      id: "zen",
      title: "The Physical Trailer",
      name: "Zen Video Production",
      link: "https://www.zenvideopro.com",
    },
  ],
}

const renderMemberEmoji = label => {
  switch (label) {
    case "Team":
      return (<Emoji symbol="🛠️" label="hammer_and_wrench" />)
    case "Honorary":
      return (<Emoji symbol="💎" label="gem" />)
    case "Seed":
      return (<Emoji symbol="🏆️" label="trophy" />)
    default:
      return null
  }
}

const MemberList = ({ members }) => (
  <div className="member-list">
    {map(members, ({ id, title, name, label, link, image }) => (
      <div
        key={`member-${name}`}
        className={classNames("start-start-aligned-row member", `${label.toLowerCase()}-member`)}
      >
        <div className={classNames("member-image")}>
          <img src={image ? getCommunityCDNUrl(image) : getCDNImageUrl("avatar.png")} alt="" />
        </div>
        <div className="left-top-aligned-column member-info">
          {title && <div className="member-title">{title}</div>}
          <div className="member-name">
            <Link href={link}>{name}</Link>
            {renderMemberEmoji(label)}
          </div>
          <div className="top-spaced-row">
            <div key={`member-${name}-label-${label}`} className={classNames("label", `label-${label.toLowerCase()}`)}>{label}</div>
            {link && (
              <Link className="request-invite button gold sm no-hover" href={link}>
                REQUEST INVITE
              </Link>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const GroupedMemberList = ({ groups = GROUPS }) => (
  <div className="grouped-member-list">
    {map(groups, (members, name) => (
      <div key={`member-group-${name}`} className="member-group">
        <div className="group-name">{name}</div>
        <MemberList members={members} />
      </div>
    ))}
  </div>
)

export default MemberList;
