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
import { TwitterLink, TelegramLink, CollectorLink } from "components/Links";
import Button from "components/Button";
import CTAButton from "components/CTAButton";

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
          {collector ? (
            <NavLink to={"/collector"} onClick={closeMenu}>
              <div className="menu-item sm text-gold">COLLECTOR'S ROOM</div>
            </NavLink>
          ) : (
            <CTAButton className="sm">APPLY FOR DIAMOND DAWN</CTAButton>
          )}
        </div>
        {collector && collector.invitations.length > 0 && (
          <div className="invitations-menu">
            <div className="menu-item sm" onClick={onInvitesTitleClick}>
              MY INVITATIONS
            </div>
            <InvitationsStatus />
          </div>
        )}
        <div className="center-center-aligned-row social-icons">
          <TwitterLink>
            <div className="icon">
              <FontAwesomeIcon icon={faTwitter} />
            </div>
          </TwitterLink>
          <TelegramLink>
            <div className="icon">
              <TelegramIcon />
            </div>
          </TelegramLink>
        </div>
      </div>
      {invitedBy?.createdBy && (
        <div className="invited-by">
          <div className="image">
            <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
          </div>
          <div className="">
            INVITED BY <CollectorLink collector={invitedBy?.createdBy} />
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default SideMenu;
