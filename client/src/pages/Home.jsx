import { Link, useSearchParams } from "react-router-dom";
import { useAxiosGet } from "../hooks/useAxiosGet";
import PostPreview from "../components/PostPreview";
import "./Home.scss";

export const categories = ["art", "business", "cinema", "food", "science", "technology"];

export default function Home() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("cat");

  const { data: posts, error } = useAxiosGet("/posts");

  let content;
  if (error) {
    content = <p className="error-msg">{error}</p>;
  } else if (posts) {
    content = (
      <div className="posts">
        {posts.map((post) => (
          <PostPreview post={post} key={post.id} />
        ))}
      </div>
    );
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return (
    <div className="page home-page">
      <div className="categories">
        <Link to="/" className={activeCategory === null ? "active" : ""}>
          ALL
        </Link>

        {categories.map((category, i) => (
          <Link to={`/?cat=${category}`} className={activeCategory === category ? "active" : ""} key={i}>
            {category.toUpperCase()}
          </Link>
        ))}
      </div>
      {content}
    </div>
  );
}
