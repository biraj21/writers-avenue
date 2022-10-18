import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import NewBlog from "./pages/NewBlog";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<NewBlog />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
      </div>
    </div>
  );
}
