import React from "react";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import InvitationsStatus from "components/InvitationsStatus";
import { collectorDisplayName, getCDNImageUrl, shortenEthAddress } from "utils";
import "./SideMenu.scss";

const SideMenu = ({ isOpen, closeMenu }) => {
  const collector = useSelector(collectorSelector);

  const invitedBy = collector?.invitedBy
    ? collector.invitedBy.twitter ||
      collector.invitedBy.email ||
      shortenEthAddress(collector.invitedBy.address)
    : null;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      ModalProps={{ onBackdropClick: closeMenu }}
    >
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
        {collector && (
          <NavLink to={"/collector"} onClick={closeMenu}>
            <div className="menu-item">COLLECTOR'S ROOM</div>
          </NavLink>
        )}
      </div>
      {collector && collector.invitations.length > 0 && (
        <div className="invitations-menu">
          <div className="menu-item">MY INVITATIONS</div>
          <InvitationsStatus />
        </div>
      )}
      {!collector && <div className="button gold">APPLY FOR DIAMOND DAWN</div>}
      {collector?.invitedBy?.createdBy && (
        <div className="invited-by">
          <div className="image">
            <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
          </div>
          <div className="">
            INVITED BY {collectorDisplayName(collector?.invitedBy?.createdBy)}
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default SideMenu;
