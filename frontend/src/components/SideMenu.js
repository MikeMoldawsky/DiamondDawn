import React from "react";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import TokensProvider from "containers/TokensProvider";

const SideMenu = ({ isOpen, closeMenu }) => {
  return (
    <Drawer anchor="right" open={isOpen}>
      <NavLink to={"/collector"} onClick={closeMenu}>
        <div className="menu-item">COLLECTOR'S ROOM</div>
      </NavLink>
      <NavLink to={"/team"} onClick={closeMenu}>
        <div className="menu-item">OUR TEAM</div>
      </NavLink>
      <NavLink to={"/faq"} onClick={closeMenu}>
        <div className="menu-item">FAQ</div>
      </NavLink>
    </Drawer>
  );
};

export default SideMenu;
