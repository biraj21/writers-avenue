import { Link } from "react-router-dom";
import "./BlogList.scss";

export default function BlogList({ title, blogs, handleDelete }) {
  return (
    <div className="blog-list">
      {title && <h2>{title}</h2>}

      {blogs.length === 0 ? <div style={{ textAlign: "center" }}>No blogs available.</div> : null}

      {blogs.map((blog) => (
        <div className="blog-preview" key={blog.id}>
          <img src={blog.imageUrl} alt="Thumbnail" className="blog-preview__image" />

          <h2 className="blog-preview__title">{blog.title}</h2>
          <small>Written by {blog.author}</small>
          <p className="blog-preview__body">{blog.body}</p>

          <div className="blog-preview__actions">
            <Link to={`/blogs/${blog.id}`} className="btn btn--small">
              Read More
            </Link>

            {handleDelete && (
              <button onClick={(e) => handleDelete(e, blog.id)} className="btn btn--small btn--red">
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
