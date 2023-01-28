import moment from "moment";
import { Link } from "react-router-dom";
import "./Comment.scss";

export default function Comment({ comment }) {
  return (
    <div className="comment">
      <div className="comment__author">
        <Link to={`/users/${comment.user.id}`}>
          <img src={comment.user.avatarUrl} alt="Avatar" className="avatar" />
        </Link>
        <div>
          <Link to={`/users/${comment.user.id}`}>{comment.user.name}</Link>
          <br />
          <small>{moment(comment.date).format("MMM Do YYYY, h:mm a")}</small>
        </div>
      </div>
      <div className="comment__body">{comment.comment}</div>
    </div>
  );
}
