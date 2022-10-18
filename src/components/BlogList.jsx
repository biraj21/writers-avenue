import { Link } from "react-router-dom";
import "./BlogList.scss";

export default function BlogList({ title, blogs, handleDelete }) {
  return (
    <div className="blog-list">
      <h2>{title}</h2>

      {blogs.map((blog) => (
        <div className="blog-preview" key={blog.id}>
          <h2 className="blog-preview__title">{blog.title}</h2>
          <small>Written by {blog.author}</small>
          <p className="blog-preview__body">{blog.body.slice(0, 80) + "..."}</p>

          <div className="blog-preview__actions">
            <button onClick={() => handleDelete(blog.id)} className="btn btn--small">
              Delete
            </button>
            <Link to={`/blogs/${blog.id}`} className="btn btn--small">
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
