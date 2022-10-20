import { useFetch } from "../hooks/useFetch";
import "./Home.scss";
import BlogList from "../components/BlogList";

export default function Home() {
  const { data: blogs, error } = useFetch(`${serverBaseUrl}/blogs`);

  let content;
  if (error) {
    content = <p className="error-msg">{error}</p>;
  } else if (blogs) {
    content = <BlogList title="All Blogs" blogs={blogs} />;
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return <div className="page home">{content}</div>;
}
