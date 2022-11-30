import React from "react";
import map from "lodash/map";
import size from "lodash/size";
import "./InvitationsStatus.scss";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import { CollectorLink } from "components/Links";
import CopyButton from "components/CopyButton";

const InvitationsStatus = () => {
  const collector = useSelector(collectorSelector);

  const invitations =
    size(collector?.invitations) > 0
      ? collector.invitations
      : [
          { _id: "0", disabled: true },
          { _id: "1", disabled: true },
        ];

  const renderStatus = ({ usedBy, disabled }) => {
    if (usedBy)
      return (
        <>
          USED BY <CollectorLink collector={usedBy} />
        </>
      );
    return disabled ? "LOCKED" : "AVAILABLE";
  };

  return (
    <div className="invitations-status">
      {map(invitations, (invite, i) => {
        const { _id, usedBy, disabled } = invite;
        const link = `${process.env.REACT_APP_INVITE_BASE_URL}?invite=${_id}`;
        return (
          <div
            key={`invitations-status-${_id}`}
            className="left-center-aligned-row status-row"
          >
            <CopyButton
              content={link}
              className="sm icon-after gold"
              disabled={disabled || !!usedBy}
              sfx="utility"
            >
              INVITATION 0{i + 1}
            </CopyButton>
            <div className="status">{renderStatus(invite)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default InvitationsStatus;
