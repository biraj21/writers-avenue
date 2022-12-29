import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { authContext } from "../contexts/authContext";
import { categories } from "./Home";
import "./Write.scss";

export default function Write() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(authContext);
  const navigate = useNavigate();

  async function handleClick(e) {
    try {
      setError(null);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    }
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setError(null);

      if (currentUser === null) {
        throw new Error("You need to be logged in!");
      }

      if (body.trim() === "") {
        throw new Error("Post body cannot be empty!");
      } else if (category === null) {
        throw new Error("Choose a category!");
      }

      setIsSubmitting(true);
      const post = new FormData(e.target);
      post.append("body", body);
      const res = await axios.post("/posts", post);
      const postId = res.data.data;
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page write-page">
      <h1>New Blog</h1>

      <form action="POST" className="form" onSubmit={handleSubmit}>
        <div className="left">
          <div className="form__field">
            <label>Blog Title:</label>
            <input
              name="title"
              type="text"
              placeholder="Blog Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form__field">
            <label>Thumbnail:</label>
            <input name="thumbnail" type="file" accept="image/png, image/gif, image/jpeg" required />
          </div>

          <div>
            <label>Body:</label>
            <ReactQuill theme="snow" value={body} onChange={setBody}></ReactQuill>
          </div>
        </div>

        <div className="right">
          <div className="category-card">
            <h2>Category</h2>

            {categories.map((category, i) => (
              <div className="category" key={i}>
                <input type="radio" name="category" required onChange={(e) => setCategory(category)} />
                &nbsp;
                <label>{category}</label>
              </div>
            ))}
          </div>

          <div className="status-card">
            <h2>Publish</h2>

            <div>
              <b>Status:</b> Draft
            </div>

            <div>
              <b>Visibility:</b> Public
            </div>

            <div className="actions">
              <button
                type="button"
                className="btn btn--stroked"
                disabled={isSubmitting}
                data-action="draft"
                onClick={handleClick}
              >
                Save As Draft
              </button>

              <button type="submit" className="btn" disabled={isSubmitting} data-action="publish">
                Publish
              </button>
            </div>

            {error && <div className="error-msg">{error}</div>}
          </div>
        </div>
      </form>
    </div>
  );
}
