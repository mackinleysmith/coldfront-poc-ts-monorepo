import { NavLink } from "react-router-dom";

const MainNav = () => (
  <div className="navbar-nav mr-auto">
    <NavLink
      to="/"
      className={({ isActive }) =>
        `nav-link ${isActive ? "router-link-exact-active" : ""}`
      }
    >
      Home
    </NavLink>
    <NavLink
      to="/profile"
      className={({ isActive }) =>
        `nav-link ${isActive ? "router-link-exact-active" : ""}`
      }
    >
      Profile
    </NavLink>
    <NavLink
      to="/wallets"
      className={({ isActive }) =>
        `nav-link ${isActive ? "router-link-exact-active" : ""}`
      }
    >
      Wallets
    </NavLink>
    <NavLink
      to="/market"
      className={({ isActive }) =>
        `nav-link ${isActive ? "router-link-exact-active" : ""}`
      }
      end
    >
      Market
    </NavLink>
  </div>
);

export default MainNav;
