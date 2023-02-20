import React from "react";
import "./MemberList.scss";
import map from "lodash/map";
import take from "lodash/take";
import Link from "components/Links";
import classNames from "classnames";
import {getCDNImageUrl, getCommunityCDNUrl} from "utils";
import Emoji from "components/Emoji";

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

const MemberList = ({ members, limit = -1 }) => {
  const displayedMembers = limit > -1 ? take(members, limit) : members

  return (
    <div className="member-list">
      {map(displayedMembers, ({ id, title, name, label, link, image }) => (
        <div
          key={`member-${id}`}
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
  )
};

export default MemberList;
