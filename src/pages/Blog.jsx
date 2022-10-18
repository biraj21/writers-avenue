import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import "./Blog.scss";

export default function Blog() {
  const { id } = useParams();
  const { data: blog, error } = useFetch(`${serverBaseUrl}/blogs/${id}`);

  let content;
  if (error) {
    content = <p className="error-msg">{error}</p>;
  } else if (blog) {
    content = (
      <>
        <h1>{blog.title}</h1>
        <small>Written by {blog.author}</small>
        <div className="blog__body">{blog.body}</div>
      </>
    );
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return <div className="page blog">{content}</div>;
}
