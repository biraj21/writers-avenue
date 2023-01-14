import moment from "moment";
import { Link } from "react-router-dom";
import "./PostPreview.scss";

export default function PostPreview({ post }) {
  const doc = new DOMParser().parseFromString(post.body, "text/html");
  return (
    <div className="post-preview">
      {post.authorId && (
        <div className="post-preview__author">
          <Link to={`/users/${post.authorId}`}>
            <img src={post.authorAvatarUrl} alt="Avatar" className="avatar" />
          </Link>
          <div>
            <Link to={`/users/${post.authorId}`}>{post.authorName}</Link>
            <br />
            <small>Posted {moment(post.uploadDate).fromNow()}</small>
          </div>
        </div>
      )}

      <img src={post.imageUrl} alt="Thumbnail" className="post-preview__image" />
      <h2 className="post-preview__title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="post-preview__body">{doc.body.textContent}</p>
      <div className="post-preview__actions"></div>
    </div>
  );
}
