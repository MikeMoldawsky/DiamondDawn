import React from "react";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import InvitationsStatus from "components/InvitationsStatus";
import { collectorDisplayName, getCDNImageUrl } from "utils";
import "./SideMenu.scss";
import {inviteSelector} from "store/inviteReducer";

const SideMenu = ({ isOpen, closeMenu }) => {
  const collector = useSelector(collectorSelector);
  const invite = useSelector(inviteSelector);

  const invitedBy = collector?.invitedBy || invite

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      ModalProps={{ onBackdropClick: closeMenu }}
    >
      <div className="stretch-top-aligned-column">
        <div className="menu">
          <NavLink to={"/explore"} onClick={closeMenu}>
            <div className="menu-item">HOMEPAGE</div>
          </NavLink>
          <NavLink to={"/about"} onClick={closeMenu}>
            <div className="menu-item">THE JOURNEY</div>
          </NavLink>
          <NavLink to={"/about"} onClick={closeMenu}>
            <div className="menu-item">ABOUT US</div>
          </NavLink>
          <NavLink to={"/collector"} onClick={closeMenu}>
            <div className="button gold sm">
              {collector ? "COLLECTOR'S ROOM" : "APPLY FOR DIAMOND DAWN"}
            </div>
          </NavLink>
        </div>
        {collector && collector.invitations.length > 0 && (
          <div className="invitations-menu">
            <div className="menu-item">INVITE</div>
            <InvitationsStatus />
          </div>
        )}
      </div>
      {invitedBy?.createdBy && (
        <div className="invited-by">
          <div className="image">
            <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
          </div>
          <div className="">
            INVITED BY <span className="text-gold">{collectorDisplayName(invitedBy?.createdBy)}</span>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default SideMenu;
