import moment from "moment";
import { Link } from "react-router-dom";
import "./PostPreview.scss";

export default function PostPreview({ post }) {
  const doc = new DOMParser().parseFromString(post.body, "text/html");
  return (
    <div className="post-preview">
      {post.author && (
        <div className="post-preview__author">
          <Link to={`/users/${post.author.id}`}>
            <img src={post.author.avatarUrl} alt="Avatar" className="avatar" />
          </Link>
          <div>
            <Link to={`/users/${post.author.id}`}>{post.author.name}</Link>
            <br />
            <small>Posted {moment(post.publishDate).fromNow()}</small>
          </div>
        </div>
      )}

      {post.coverUrl && <img src={post.coverUrl} alt="Thumbnail" className="post-preview__image" />}
      <h2 className="post-preview__title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="post-preview__body">{doc.body.textContent}</p>
      <div className="post-preview__actions"></div>
    </div>
  );
}
