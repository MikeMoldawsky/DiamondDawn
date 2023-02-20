import React from "react";
import Drawer from "@mui/material/Drawer";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import InvitationsStatus from "components/InvitationsStatus";
import {getCDNImageUrl, isWebsiteOpen} from "utils";
import "./SideMenu.scss";
import { inviteSelector } from "store/inviteReducer";
import { CollectorLink } from "components/Links";
import CTAButton from "components/CTAButton";
import SocialIcons from "components/SocialIcons";
import { setSideMenuOpen, uiSelector } from "store/uiReducer";

const SideMenu = () => {
  const collector = useSelector(collectorSelector);
  const invite = useSelector(inviteSelector);
  const { sideMenuOpen } = useSelector(uiSelector);
  const dispatch = useDispatch();

  let invitedBy = invite;
  if (collector) {
    invitedBy = collector.invitedBy;
  }
  if (!invitedBy && collector?.approved) {
    invitedBy = {
      inviter: { twitter: "@DiamondDawnNFT" },
    };
  }

  const closeMenu = () => dispatch(setSideMenuOpen(false));

  return (
    <Drawer
      anchor="right"
      open={sideMenuOpen}
      ModalProps={{ onBackdropClick: closeMenu }}
    >
      <div className="stretch-top-aligned-column">
        {isWebsiteOpen() && (
          <div className="menu">
            <NavLink to={"/explore"} onClick={closeMenu}>
              <div className="menu-item">HOMEPAGE</div>
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
            {collector && (collector.minted || collector.mintedHonorary) && (
              <NavLink to={"/collector"} onClick={closeMenu}>
                <div className="menu-item">COLLECTOR'S ROOM</div>
              </NavLink>
            )}
            {(!collector || !collector.mintedAll) && (
              <CTAButton className="md" onClick={closeMenu} />
            )}
          </div>
        )}
        <div className="invitations-menu">
          <Link to={"/invites"} onClick={closeMenu}>
            <div className="menu-item sm link-hover text-gold">
              INVITE A FRIEND
            </div>
          </Link>
          <InvitationsStatus />
        </div>
        {invitedBy && (
          <div className="invited-by">
            <div className="image">
              <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
            </div>
            <div className="center-center-aligned-row invited-by-text">
              <div>
                INVITED BY{" "}
                <CollectorLink
                  collector={invitedBy?.inviter}
                  twitter={invitedBy?.inviterName}
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
