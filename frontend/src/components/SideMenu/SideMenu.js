import React from "react";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import InvitationsStatus from "components/InvitationsStatus";
import { collectorDisplayName, getCDNImageUrl } from "utils";
import "./SideMenu.scss";
import { inviteSelector } from "store/inviteReducer";
import useGoToInvites from "hooks/useGoToInvites";
import TelegramIcon from "@mui/icons-material/Telegram";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const SideMenu = ({ isOpen, closeMenu }) => {
  const collector = useSelector(collectorSelector);
  const invite = useSelector(inviteSelector);

  const invitedBy = collector?.invitedBy || invite;

  const goToInvites = useGoToInvites();

  const onInvitesTitleClick = () => {
    goToInvites();
    closeMenu();
  };

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
          <NavLink to={"/the-journey"} onClick={closeMenu}>
            <div className="menu-item">THE JOURNEY</div>
          </NavLink>
          <NavLink to={"/about-us"} onClick={closeMenu}>
            <div className="menu-item">ABOUT US</div>
          </NavLink>
          <NavLink to={"/technology"} onClick={closeMenu}>
            <div className="menu-item">TIMELESS TECHNOLOGY</div>
          </NavLink>
        </div>
        <NavLink to={"/collector"} onClick={closeMenu}>
          {collector ? (
            <div className="menu-item sm">COLLECTOR'S ROOM</div>
          ) : (
            <div className="button gold sm">APPLY FOR DIAMOND DAWN</div>
          )}
        </NavLink>
        {collector && collector.invitations.length > 0 && (
          <div className="invitations-menu">
            <div className="menu-item sm" onClick={onInvitesTitleClick}>
              MY INVITATION
            </div>
            <InvitationsStatus />
          </div>
        )}
        <div className="center-center-aligned-row social-icons">
          <div className="icon">
            <FontAwesomeIcon icon={faTwitter} />
          </div>
          <div className="icon">
            <TelegramIcon />
          </div>
        </div>
      </div>
      {invitedBy?.createdBy && (
        <div className="invited-by">
          <div className="image">
            <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
          </div>
          <div className="">
            INVITED BY{" "}
            <span className="text-gold">
              {collectorDisplayName(invitedBy?.createdBy)}
            </span>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default SideMenu;
