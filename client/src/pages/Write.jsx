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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useContext(authContext);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const post = { title: title.trim(), author: currentUser.name, body: body.trim() };
    console.log(post);
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
          <div className="status-card">
            <h2>Publish</h2>

            <div>
              <b>Status:</b> Draft
            </div>

            <div>
              <b>Visibility:</b> Public
            </div>

            <div className="actions">
              <button className="btn btn--stroked" disabled={isSubmitting} data-action="saveDraft">
                {isSubmitting ? "Saving..." : "Save As Draft"}
              </button>
              <button type="submit" className="btn" disabled={isSubmitting} data-action="publish">
                {isSubmitting ? "Saving..." : "Publish"}
              </button>
            </div>
          </div>

          <div className="category-card">
            <h2>Category</h2>

            {categories.map((category, i) => (
              <div className="category" key={i}>
                <input type="radio" name="category" required />
                &nbsp;
                <label>{category}</label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
