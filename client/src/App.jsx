import { useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import { authContext } from "./contexts/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Post from "./pages/Post";
import Register from "./pages/Register";
import Write from "./pages/Write";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<Post />} />

          {/* these routes should only be accessible when the user IS NOT logged in */}
          <Route element={<OnlyUnauthRoutes redirectTo="/" />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* these routes should only be accessible when the user IS logged in */}
          <Route element={<AuthRoutes redirectTo="/login" />}>
            <Route path="/write" element={<Write />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function AuthRoutes({ redirectTo }) {
  if (!redirectTo) {
    throw new Error("<AuthRoutes />: prop 'redirectTo' is required!");
  }

  const { currentUser } = useContext(authContext);
  return currentUser ? <Outlet /> : <Navigate to={redirectTo} />;
}

function OnlyUnauthRoutes({ redirectTo }) {
  if (!redirectTo) {
    throw new Error("<OnlyUnauthRoutes/>: prop 'redirectTo' is required!");
  }

  const { currentUser } = useContext(authContext);
  return currentUser ? <Navigate to={redirectTo} /> : <Outlet />;
}
