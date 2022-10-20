import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import AdminHome from "./pages/admin/Home";
import Login from "./pages/admin/Login";
import NewBlog from "./pages/admin/NewBlog";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";

const links = [
  { path: "/", text: "Home", end: true },
  { path: "/admin/login", text: "Login" },
  { path: "/admin", text: "Admin Home", end: true },
  { path: "/admin/create", text: "New Blog" },
];

export default function App() {
  return (
    <div className="app">
      <Navbar links={links} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/create" element={<NewBlog />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}
