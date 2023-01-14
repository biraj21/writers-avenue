import moment from "moment";
import { Link } from "react-router-dom";
import "./PostPreview.scss";

export default function PostPreview({ post }) {
  const doc = new DOMParser().parseFromString(post.body, "text/html");
  return (
    <div className="post-preview">
      <div className="post-preview__author">
        <img src={post.authorAvatarUrl} alt="Avatar" className="avatar" />
        <div>
          <span>{post.authorName}</span>
          <br />
          <small>Posted {moment(post.uploadDate).fromNow()}</small>
        </div>
      </div>
      <img src={post.imageUrl} alt="Thumbnail" className="post-preview__image" />
      <h2 className="post-preview__title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="post-preview__body">{doc.body.textContent}</p>
      <div className="post-preview__actions"></div>
    </div>
  );
}
