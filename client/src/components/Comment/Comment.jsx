import moment from "moment";
import { Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import "./Comment.scss";

export default function Comment({ comment, handleDelete }) {
  return (
    <div className="comment">
      {handleDelete && (
        <button className="comment__delete-btn" onClick={() => handleDelete(comment.id)} title="Delete Comment">
          <Trash2 color="var(--red)" />
        </button>
      )}
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
      <div className="comment__body">{comment.body}</div>
    </div>
  );
}
