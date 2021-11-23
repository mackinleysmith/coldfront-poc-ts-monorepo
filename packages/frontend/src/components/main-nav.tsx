import {NavLink} from "react-router-dom";
import React from "react";

const MainNav = () => (
  <div className="navbar-nav mr-auto">
    <NavLink
      to="/"
      className={({ isActive }) => `nav-link ${isActive ? 'router-link-exact-active' : ''}`}
    >
      Home
    </NavLink>
    <NavLink
      to="/profile"
      className={({ isActive }) => `nav-link ${isActive ? 'router-link-exact-active' : ''}`}
    >
      Profile
    </NavLink>
    <NavLink
      to="/wallets"
      className={({ isActive }) => `nav-link ${isActive ? 'router-link-exact-active' : ''}`}
      end
    >
      Wallets
    </NavLink>
  </div>
);

export default MainNav;