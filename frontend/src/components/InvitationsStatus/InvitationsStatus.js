import React from "react";
import map from "lodash/map";
import "./InvitationsStatus.scss";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import classNames from "classnames";
import { collectorDisplayName } from "utils";

const InvitationsStatus = () => {
  const collector = useSelector(collectorSelector);
  if (!collector) return null;

  return (
    <div className="invitations-status">
      {map(collector.invitations, ({ _id, usedBy }, i) => {
        const link = `${process.env.REACT_APP_INVITE_BASE_URL}?invite=${_id}`;
        return (
          <div
            key={`invitations-status-${_id}`}
            className="center-start-aligned-row status-row"
          >
            <CopyToClipboard text={link}>
              <div
                className={classNames("button sm icon-after gold", {
                  disabled: !!usedBy,
                })}
              >
                INVITATION 0{i + 1} <ContentCopyIcon />
              </div>
            </CopyToClipboard>
            <div className="status">
              {usedBy ? "USED BY" : "AVAILABLE"}
              {usedBy && (
                <span className="text-gold">{" " + collectorDisplayName(usedBy)}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvitationsStatus;
