import { NavLink } from "react-router-dom";
import "./Navbar.scss";

const activeClassName = "active";

export default function Navbar({ links }) {
  return (
    <nav className="navbar">
      <div className="wrapper">
        <h1>Blogs</h1>
        <div className="navbar__links">
          {links.map((link) => (
            <NavLink
              to={link.path}
              key={link.path}
              className={({ isActive }) => (isActive ? activeClassName : null)}
              end={link.end}
            >
              {link.text}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
