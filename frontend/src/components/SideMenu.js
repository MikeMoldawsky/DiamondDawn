import React from "react";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";

const SideMenu = ({ isOpen, closeMenu }) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      ModalProps={{ onBackdropClick: closeMenu }}
    >
      <NavLink to={"/collector"} onClick={closeMenu}>
        <div className="menu-item">COLLECTOR'S ROOM</div>
      </NavLink>
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
    </Drawer>
  );
};

export default SideMenu;
