import React from "react";
import "./MemberList.scss";
import map from "lodash/map";
import Link from "components/Links";
import classNames from "classnames";

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

const MemberList = ({ members }) => (
  <div className="member-list">
    {map(members, ({ id, title, name, link }) => (
      <div
        key={`member-${name}`}
        className="start-start-aligned-row member"
      >
        <div className={classNames("profile-image", id)} />
        <div className="left-top-aligned-column">
          {title && <div className="member-title">{title}</div>}
          <div className="right-spaced-column">
            <div className="member-name">
              <Link href={link}>{name}</Link>
            </div>
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
