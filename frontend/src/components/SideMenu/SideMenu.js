import React from "react";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import InvitationsStatus from "components/InvitationsStatus";
import { getCDNImageUrl } from "utils";
import "./SideMenu.scss";
import { inviteSelector } from "store/inviteReducer";
import useGoToInvites from "hooks/useGoToInvites";
import { CollectorLink } from "components/Links";
import CTAButton from "components/CTAButton";
import SocialIcons from "components/SocialIcons";

const SideMenu = ({ isOpen, closeMenu }) => {
  const collector = useSelector(collectorSelector);
  const invite = useSelector(inviteSelector);
  
  let invitedBy = invite
  if (collector) {
    invitedBy = collector.invitedBy || { createdBy: { twitter: "@DiamondDawnNFT"}}
  }

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
          <NavLink to={"/faq"} onClick={closeMenu}>
            <div className="menu-item">FAQs</div>
          </NavLink>
          {collector ? (
            <NavLink to={"/collector"} onClick={closeMenu}>
              <div className="menu-item">COLLECTOR'S ROOM</div>
            </NavLink>
          ) : (
            <CTAButton className="md" onClick={closeMenu}>
              APPLY FOR DIAMOND DAWN
            </CTAButton>
          )}
        </div>
        <div className="invitations-menu">
          <div
            className="menu-item sm link-hover text-gold"
            onClick={onInvitesTitleClick}
          >
            INVITE A FRIEND
          </div>
          <InvitationsStatus />
        </div>
        {invitedBy?.createdBy && (
          <div className="invited-by">
            <div className="image">
              <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
            </div>
            <div className="center-center-aligned-row invited-by-text">
              <div>
                INVITED BY{" "}
                <CollectorLink
                  collector={invitedBy?.createdBy}
                  twitter={invitedBy?.inviter}
                />
              </div>
            </div>
          </div>
        )}
        <SocialIcons />
      </div>
    </Drawer>
  );
};

export default SideMenu;
