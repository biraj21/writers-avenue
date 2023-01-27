import { Link, useSearchParams } from "react-router-dom";
import categories from "../../categories";
import Loader from "components/Loader/Loader";
import PostPreview from "components/PostPreview/PostPreview";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./Home.scss";

export default function Home() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("cat");
  const { data: posts, error } = useAxiosGet(`/posts${category ? `?cat=${category}` : ""}`);

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (posts) {
    content = (
      <div className="posts">
        {posts.length === 0 && <div style={{ textAlign: "center" }}>no posts found in this category</div>}
        {posts.map((post) => {
          return <PostPreview post={post} key={post.id} />;
        })}
      </div>
    );
  } else {
    content = <Loader />;
  }

  return (
    <div className="page" id="home-page">
      <div className="categories">
        <Link to="/" className={`pill ${category === null ? "active" : ""}`}>
          ALL
        </Link>

        {categories.map((cat, i) => (
          <Link to={`/?cat=${cat}`} className={`pill ${category === cat ? "active" : ""}`} key={i}>
            {cat.toUpperCase()}
          </Link>
        ))}
      </div>
      {content}
    </div>
  );
}
