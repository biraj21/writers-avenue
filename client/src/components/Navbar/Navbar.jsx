import { useContext, useEffect, useState } from "react";
import { BookOpen } from "react-feather";
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
          <Link to="/">
            <BookOpen />
            <div>
              <span>Writer's</span>
              <small>Avenue</small>
            </div>
          </Link>
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
            src={currentUser.avatarUrl}
            className="user-avatar avatar"
            alt="User's avatar"
            onClick={handleAvatarClick}
          />
        )}

        {currentUser && (
          <div className={`user ${showUserCard ? "user--active" : ""}`}>
            <Link to={`/users/${currentUser.id}`}>
              <img src={currentUser.avatarUrl} className="user__avatar" alt="User's avatar" />
            </Link>
            <Link to={`/users/${currentUser.id}`} className="user__name">
              {currentUser.name}
            </Link>
            <small className="user__email">{currentUser.email}</small>
            <button className="btn user__logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
