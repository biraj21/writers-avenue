import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { authContext } from "contexts/auth";
import "./Navbar.scss";

export default function Navbar() {
  const { currentUser, logout } = useContext(authContext);
  const [showUserCard, setShowUserCard] = useState(false);

  function closeUserCard(e) {
    // console.log(e.target);
    const $userCard = document.querySelector(".user");
    if (e.target === $userCard) {
      return;
    }

    setShowUserCard(false);
  }

  useEffect(() => {
    document.addEventListener("click", closeUserCard);
    return () => document.removeEventListener("click", closeUserCard);
  });

  function handleAvatarClick(e) {
    if (!showUserCard) {
      setShowUserCard(true);
    }

    e.stopPropagation();
  }

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
          {!currentUser && <NavLink to="/login">Login</NavLink>}
        </div>

        {currentUser && (
          <img
            src={serverBaseUrl + currentUser.imageUrl}
            className="user-avatar avatar"
            alt="User's avatar"
            onClick={handleAvatarClick}
          />
        )}

        {currentUser && (
          <div className={`user ${showUserCard ? "user--active" : ""}`}>
            <img src={serverBaseUrl + currentUser.imageUrl} className="user__avatar" alt="User's avatar" />
            <span className="user__name">{currentUser.name}</span>
            <button className="btn user__logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
