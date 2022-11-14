import React from "react";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import {useSelector} from "react-redux";
import {collectorSelector} from "store/collectorReducer";

const SideMenu = ({ isOpen, closeMenu }) => {
  const collector = useSelector(collectorSelector)

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      ModalProps={{ onBackdropClick: closeMenu }}
    >
      <NavLink to={"/about"} onClick={closeMenu}>
        <div className="menu-item">ABOUT</div>
      </NavLink>
      <NavLink to={"/about/#journey"} onClick={closeMenu}>
        <div className="menu-item">THE JOURNEY</div>
      </NavLink>
      <NavLink to={"/about/#team"} onClick={closeMenu}>
        <div className="menu-item">OUR TEAM</div>
      </NavLink>
      <NavLink to={"/about/#faq"} onClick={closeMenu}>
        <div className="menu-item">FAQ</div>
      </NavLink>
      <NavLink to={"/collector"} onClick={closeMenu}>
        <div className="menu-item">{collector ? "COLLECTOR'S ROOM" : "APPLY FOR DIAMOND DAWN"}</div>
      </NavLink>
    </Drawer>
  );
};

export default SideMenu;
