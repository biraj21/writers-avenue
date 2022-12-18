import { Link } from "react-router-dom";
import "./PostList.scss";

export default function PostList({ posts, handleDelete }) {
  return (
    <div className="post-list">
      {posts.length === 0 ? <div style={{ textAlign: "center" }}>No blogs available.</div> : null}

      {posts.map((post) => (
        <div className="post-preview" key={post.id}>
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

            {handleDelete && (
              <button onClick={(e) => handleDelete(e, post.id)} className="btn btn--small btn--red">
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
