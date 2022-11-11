import { Link } from "react-router-dom";
import "./BlogList.scss";

export default function BlogList({ blogs, handleDelete }) {
  return (
    <div className="blog-list">
      {blogs.length === 0 ? <div style={{ textAlign: "center" }}>No blogs available.</div> : null}

      {blogs.map((blog) => (
        <div className="blog-preview" key={blog.id}>
          <div className="blog-preview__author">
            <img src={blog.author.imageUrl} alt="Avatar" />
            <div>
              <span>{blog.author.name}</span>
              <br />
              <small>Posted 2 days ago</small>
            </div>
          </div>

          <img src={blog.imageUrl} alt="Thumbnail" className="blog-preview__image" />
          <h2 className="blog-preview__title">{blog.title}</h2>
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
