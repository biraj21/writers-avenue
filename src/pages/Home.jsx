import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import "./Home.scss";
import BlogList from "../components/BlogList";

export default function Home() {
  const { data: blogs, setData: setBlogs, error, setError } = useFetch(`${serverBaseUrl}/blogs`);
  const [deleteId, setDeleteId] = useState(null);

  function handleDelete(id) {
    setDeleteId(id);

    fetch(`${serverBaseUrl}/blogs/${id}`, { method: "DELETE" })
      .then((_res) => {
        const newBlogs = blogs.filter((blog) => blog.id !== id);
        setBlogs(newBlogs);
      })
      .catch((err) => setError(err.message));
  }

  let content;
  if (error) {
    content = <p className="error-msg">{error}</p>;
  } else if (blogs) {
    content = (
      <BlogList title="All Blogs" blogs={blogs} handleDelete={handleDelete} deleteId={deleteId} />
    );
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return <div className="page home">{content}</div>;
}
