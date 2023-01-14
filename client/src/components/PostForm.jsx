import axios from "axios";
import { useState } from "react";
import { Trash2 } from "react-feather";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import categories from "../categories";
import "./PostForm.scss";

// to be used to create & edit posts
export default function PostForm({ defaults }) {
  const [title, setTitle] = useState(defaults?.title, "");
  const [thumbnail, setThumbnail] = useState(null);
  const [body, setBody] = useState(defaults?.body, "");
  const [category, setCategory] = useState(defaults?.category, "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
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

      if (body.trim() === "") {
        throw new Error("Post body cannot be empty!");
      } else if (category === null) {
        throw new Error("Choose a category!");
      }

      setIsSubmitting(true);
      const post = new FormData();
      post.set("title", title);
      post.set("thumbnail", thumbnail ? thumbnail : defaults.imageUrl);
      post.set("body", body);
      post.set("category", category);

      if (defaults) {
        await axios.put(`/posts/${defaults.id}`, post);
        navigate(`/posts/${defaults.id}`);
      } else {
        const res = await axios.post("/posts", post);
        const postId = res.data.data;
        navigate(`/posts/${postId}`);
      }
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
    <form action="POST" className="form post-form" onSubmit={handleSubmit}>
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
          <input
            name="thumbnail"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            required={!Boolean(defaults)}
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        {(thumbnail || defaults) && (
          <div className="preview">
            <span>Preview:</span>
            {thumbnail ? <img src={URL.createObjectURL(thumbnail)} /> : <img src={serverBaseUrl + defaults.imageUrl} />}
            {/* user can only remove the new thumbnail not the old one */}
            {thumbnail && (
              <button type="button" title="Remove Thumbnail" onClick={() => setThumbnail(null)}>
                <Trash2 color="var(--red)" />
              </button>
            )}
          </div>
        )}

        <div>
          <label>Body:</label>
          <ReactQuill theme="snow" value={body} onChange={setBody}></ReactQuill>
        </div>
      </div>

      <div className="right">
        <div className="category-card">
          <h2>Category</h2>

          {categories.map((cat, i) => (
            <div className="category" key={i}>
              <input
                type="radio"
                name="category"
                required
                onChange={(e) => setCategory(cat)}
                checked={cat === category}
              />
              &nbsp;
              <label>{cat}</label>
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
  );
}
