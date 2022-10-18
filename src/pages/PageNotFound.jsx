import { Link } from "react-router-dom";
import "./PageNotFound.scss";

export default function PageNotFound() {
  return (
    <div className="page not-found">
      <h2>We didn't find the page that you are looking for.</h2>
      <Link to="/" className="btn">
        Homepage
      </Link>
    </div>
  );
}
