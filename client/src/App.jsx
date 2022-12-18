import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import Post from "./pages/Post";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Register";
import Write from "./pages/Write";

const links = [
  { path: "/", text: "Home", end: true },
  { path: "/write", text: "Write" },
  { path: "/login", text: "Login" },
];

export default function App() {
  return (
    <div className="app">
      <Navbar links={links} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/write" element={<Write />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}
