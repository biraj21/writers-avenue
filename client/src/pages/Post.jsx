import moment from "moment";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Edit, Trash2 } from "react-feather";
import { authContext } from "../contexts/authContext";
import { useAxiosGet } from "../hooks/useAxiosGet";
import "./Post.scss";

export default function Post() {
  const { id } = useParams();
  const { data: post, error } = useAxiosGet(`/posts/${id}`);
  const { currentUser } = useContext(authContext);

  function handleDelete(e) {
    if (!confirm("This post will be permanently deleted. Are you sure?")) {
      return;
    }

    console.log("deleted");
  }

  const postActionsJSX = (
    <div className="post__actions">
      <Link to="/write?edit=2" title="Edit Post">
        <Edit color="var(--primary-color)" />
      </Link>

      <button onClick={handleDelete} title="Delete Post">
        <Trash2 color="var(--red)" />
      </button>
    </div>
  );

  let content;
  if (error) {
    content = <p className="error-msg">{error}</p>;
  } else if (post) {
    content = (
      <div className="post">
        <h1>{post.title}</h1>
        <img src={post.imageUrl} alt="Thumbnail" />

        <div className="post__author">
          <img src={post.authorAvatarUrl} alt="Avatar" />
          <div>
            <span>Written by {post.authorName}</span>
            <br />
            <small>{moment(post.uploadDate).fromNow()}</small>
          </div>

          {currentUser?.id === post.authorId && postActionsJSX}
        </div>

        <div className="post__body">{post.body}</div>
      </div>
    );
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return <div className="page post-page">{content}</div>;
}
