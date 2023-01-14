import { useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "components/Navbar/Navbar";
import { authContext } from "contexts/auth";
import Home from "pages/Home/Home";
import Login from "pages/Login/Login";
import PageNotFound from "pages/PageNotFound/PageNotFound";
import Post from "pages/Post/Post";
import PostEdit from "pages/PostEdit/PostEdit";
import PostWrite from "pages/PostWrite/PostWrite";
import Register from "pages/Register/Register";
import "./App.scss";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<Post />} />

          {/* these routes should only be accessible when the user IS NOT logged in */}
          <Route element={<OnlyUnauthRoutes redirectTo="/" />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* these routes should only be accessible when the user IS logged in */}
          <Route element={<AuthRoutes redirectTo="/login" />}>
            <Route path="/edit/:id" element={<PostEdit />} />
            <Route path="/write" element={<PostWrite />} />
          </Route>

          {/* a catchall route for displaying 404 page */}
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
