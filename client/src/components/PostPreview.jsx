import { Link } from "react-router-dom";
import "./PostPreview.scss";

export default function PostPreview({ post }) {
  return (
    <div className="post-preview">
      <div className="post-preview__author">
        <img src={post.author.imageUrl} alt="Avatar" />
        <div>
          <span>{post.author.name}</span>
          <br />
          <small>Posted 2 days ago</small>
        </div>
      </div>

      <img src={post.imageUrl} alt="Thumbnail" className="post-preview__image" />
      <h2 className="post-preview__title">{post.title}</h2>
      <p className="post-preview__body">{post.body}</p>

      <div className="post-preview__actions">
        <Link to={`/posts/${post.id}`} className="btn btn--small">
          Read More
        </Link>
      </div>
    </div>
  );
}
