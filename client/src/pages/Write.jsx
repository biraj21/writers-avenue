import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Write.scss";

export default function Write() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const blog = { title: title.trim(), author: "Biraj", body: body.trim() };

    fetch(`${serverBaseUrl}/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
    })
      .then((res) => res.json())
      .then(({ id }) => navigate(`/blogs/${id}`))
      .catch((err) => console.error(err));
  }

  return (
    <div className="page write-page">
      <h1>New Blog</h1>

      <form action="POST" className="form" onSubmit={handleSubmit}>
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

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
