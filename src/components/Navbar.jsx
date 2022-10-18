import { NavLink } from "react-router-dom";
import "./Navbar.scss";

const links = [
  { path: "/", text: "Home", end: true },
  { path: "/create", text: "New Blog" },
];

const activeClassName = "active";

export default function Navbar() {
  return (
    <nav className="navbar">
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
    </nav>
  );
}
