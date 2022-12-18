import { Link, useParams } from "react-router-dom";
import { useAxiosGet } from "../hooks/useAxiosGet";
import "./Post.scss";

export default function Post() {
  const { id } = useParams();
  const { data: post, error } = useAxiosGet(`/posts/${id}`);

  function handleDelete(e) {
    if (!confirm("This post will be permanently deleted. Are you sure?")) {
      return;
    }

    console.log("deleted");
  }

  let content;
  if (error) {
    content = <p className="error-msg">{error}</p>;
  } else if (post) {
    content = (
      <div className="post">
        <div className="post__actions">
          <Link to="/write?edit=2" className="btn">
            Edit
          </Link>

          <button className="btn btn--red" onClick={handleDelete}>
            Delete
          </button>
        </div>

        <h1>{post.title}</h1>
        <img src={post.imageUrl} alt="Thumbnail" />

        <div className="post__author">
          <img src={post.author.imageUrl} alt="Avatar" />
          <div>
            <span>Written by {post.author.name}</span>
            <br />
            <small>Posted 2 days ago</small>
          </div>
        </div>

        <div className="post__body">{post.body}</div>
      </div>
    );
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return <div className="page post-page">{content}</div>;
}
