import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { authContext } from "../contexts/authContext";
import "./Navbar.scss";

export default function Navbar() {
  const { currentUser, logout } = useContext(authContext);

  return (
    <nav className="navbar">
      <div className="wrapper">
        <h1>
          <Link to="/">Blogs</Link>
        </h1>
        <div className="navbar__links">
          <NavLink to="/" end={true}>
            Home
          </NavLink>

          <NavLink to="/write">Write</NavLink>

          {currentUser ? (
            <button className="btn" onClick={logout}>
              Logout
            </button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
