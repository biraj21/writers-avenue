import { useFetch } from "../hooks/useFetch";
import "./Home.scss";
import BlogList from "../components/BlogList";

export default function Home({ deletedBlogs = new Set() }) {
  const { data: blogs, setData: setBlogs, error, setError } = useFetch(`${serverBaseUrl}/blogs`);

  function handleDelete(e, id) {
    const $btn = e.target;
    $btn.disabled = true;
    $btn.innerText = "Deleting...";

    fetch(`${serverBaseUrl}/blogs/${id}`, { method: "DELETE" })
      .then((_res) => {
        deletedBlogs.add(id);
        const newBlogs = blogs.filter((blog) => !deletedBlogs.has(blog.id));
        setBlogs(newBlogs);
      })
      .catch((err) => setError(err.message));
  }

  let content;
  if (error) {
    content = <p className="error-msg">{error}</p>;
  } else if (blogs) {
    content = <BlogList title="All Blogs" blogs={blogs} handleDelete={handleDelete} />;
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return <div className="page home">{content}</div>;
}
