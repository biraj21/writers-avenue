import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import "./Blog.scss";

export default function Blog() {
  const { id } = useParams();
  const { data: blog, error } = useFetch(`${serverBaseUrl}/blogs/${id}`);

  function handleDelete(e) {
    if (!confirm("This post will be permanently deleted. Are you sure?")) {
      return;
    }

    console.log("deleted");
  }

  let content;
  if (error) {
    content = <p className="error-msg">{error}</p>;
  } else if (blog) {
    content = (
      <>
        <div className="blog__actions">
          <Link to="/write?edit=2" className="btn">
            Edit
          </Link>

          <button className="btn btn--red" onClick={handleDelete}>
            Delete
          </button>
        </div>

        <h1>{blog.title}</h1>
        <img src={blog.imageUrl} alt="Thumbnail" />

        <div className="blog__author">
          <img src={blog.author.imageUrl} alt="Avatar" />
          <div>
            <span>Written by {blog.author.name}</span>
            <br />
            <small>Posted 2 days ago</small>
          </div>
        </div>

        <div className="blog__body">{blog.body}</div>
      </>
    );
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return <div className="page blog">{content}</div>;
}
