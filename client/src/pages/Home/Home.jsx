import { Link, useSearchParams } from "react-router-dom";
import categories from "../../categories";
import Loader from "components/Loader/Loader";
import PostPreview from "components/PostPreview/PostPreview";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./Home.scss";

export default function Home() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("cat");

  const { data: posts, error } = useAxiosGet(`/posts${activeCategory ? `?cat=${activeCategory}` : ""}`);

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (posts) {
    content = (
      <div className="posts">
        {posts.length === 0 && "No posts found in this category."}
        {posts.map((post) => {
          const rpost = {
            ...post,
            imageUrl: serverBaseUrl + post.imageUrl,
            authorAvatarUrl: serverBaseUrl + post.authorAvatarUrl,
          };
          return <PostPreview post={rpost} key={post.id} />;
        })}
      </div>
    );
  } else {
    content = <Loader />;
  }

  return (
    <div className="page" id="home-page">
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
