import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const authContext = createContext(null);

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  async function login(user) {
    const res = await axios.post("/auth/login", user);
    setCurrentUser(res.data.data);
    localStorage.setItem("token", res.data.token);
    navigate("/");
  }

  async function register(user) {
    const res = await axios.post("/auth/register", user);
    setCurrentUser(res.data.data);
    localStorage.setItem("token", res.data.token);
    navigate("/");
  }

  function logout() {
    setCurrentUser(null);
    localStorage.clear();
    navigate("/");
  }

  return <authContext.Provider value={{ currentUser, login, logout, register }}>{children}</authContext.Provider>;
}
