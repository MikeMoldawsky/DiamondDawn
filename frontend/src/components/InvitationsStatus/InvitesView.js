import React from "react";
import {getCDNImageUrl} from "utils";
import InvitationsStatus from "./InvitationsStatus";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const InvitesView = ({ withBackButton, backButtonClick }) => {
  return (
    <div className="center-aligned-column invites-view">
      {withBackButton && (
        <div className="back-button" onClick={backButtonClick}>
          <ArrowBackIosNewIcon />
        </div>
      )}
      <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
      <div className="text">
        Diamond Dawn's invitation system is designed to ensure fairness
        by granting you the power to choose who should join the project.
        <br />
        <br />
        <b>These invitations are extremely valuable.</b>
        <br />
        <br />
        Why?
        <br />
        Because your invited friends will get priority in the review
        process over other collectors.
      </div>
      <InvitationsStatus />
    </div>
  )
}

export default InvitesView