import React from "react";
import map from "lodash/map";
import "./InvitationsStatus.scss";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { collectorDisplayName } from "utils";
import Button from "components/Button";
import {CollectorLink} from "components/Links";

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
              <Button className="sm icon-after gold" disabled={!!usedBy} sfx="utility">
                INVITATION 0{i + 1} <ContentCopyIcon />
              </Button>
            </CopyToClipboard>
            <div className="status">
              {usedBy ? "USED BY " : "AVAILABLE"}
              {usedBy && (
                <CollectorLink collector={usedBy} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvitationsStatus;
