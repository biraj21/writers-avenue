import axios from "axios";
import { useState } from "react";
import { Trash2 } from "react-feather";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import categories from "../../categories";
import "./PostForm.scss";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    [{ align: [] }],
    ["image"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    ["clean"], // remove formatting button
  ],
};

// to be used to create & edit posts
export default function PostForm({ defaults, changes }) {
  const [title, setTitle] = useState(defaults ? defaults.title : "");
  const [cover, setCover] = useState(null);
  const [body, setBody] = useState(defaults?.body || "");
  const [category, setCategory] = useState(defaults?.category || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleDraftSubmit() {
    try {
      if (title.trim().length === 0) {
        throw new Error("title is required");
      }

      setError(null);
      setIsSubmitting(true);

      const post = new FormData();
      post.set("title", title);
      post.set("body", body);
      post.set("category", category);
      if (cover) {
        post.set("cover", cover);
      }

      if (defaults) {
        await axios.put(`/posts/changes/${defaults.id}`, post);
        navigate(`/posts/${defaults.id}`);
      } else {
        const res = await axios.post("/posts/drafts", post);
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

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      if (body.trim() === "") {
        throw new Error("post body cannot be empty");
      } else if (category === null) {
        throw new Error("choose a category");
      }

      setError(null);
      setIsSubmitting(true);

      const post = new FormData();
      post.set("title", title);
      post.set("body", body);
      post.set("category", category);
      if (cover) {
        post.set("cover", cover);
      }

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
    <form className="form post-form" onSubmit={handleSubmit}>
      <div className="left">
        <div className="form__field">
          <label>Blog title:</label>
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
          <label>Cover image:</label>
          <input
            name="cover"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            // required={!defaults || !defaults.coverUrl}
            onChange={(e) => setCover(e.target.files[0])}
          />
        </div>

        {(cover || defaults?.coverUrl) && (
          <div className="preview">
            <span>Preview:</span>
            {cover ? <img src={URL.createObjectURL(cover)} /> : <img src={defaults.coverUrl} />}
            {/* user can only remove the new cover not the old one */}
            {cover && (
              <button type="button" title="Remove Image" onClick={() => setCover(null)}>
                <Trash2 color="var(--red)" />
              </button>
            )}
          </div>
        )}

        <div>
          <label>Body:</label>
          <ReactQuill theme="snow" modules={modules} value={body} onChange={setBody}></ReactQuill>
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
          <b>Status:</b> {defaults ? `${defaults.status}${changes ? " (draft version)" : ""}` : "new"}
          <br />
          <b>Visibility:</b> Public
          <div className="actions">
            <button className="btn" disabled={isSubmitting}>
              {defaults ? "Update" : "Publish"}
            </button>

            <button type="button" className="btn btn--stroked" disabled={isSubmitting} onClick={handleDraftSubmit}>
              Save Draft
            </button>
          </div>
          {error && <div className="error-msg">{error}</div>}
        </div>
      </div>
    </form>
  );
}
