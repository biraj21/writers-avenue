import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import categories from "../../categories";
import Loader from "components/Loader/Loader";
import PostPreview from "components/PostPreview/PostPreview";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./Home.scss";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const { data: posts, error } = useAxiosGet(`/posts${window.location.search}`);

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (posts) {
    content = (
      <>
        <form className="form" onSubmit={handleSearchSubmit}>
          <div className="form__field">
            <input
              name="search"
              type="text"
              placeholder="Search posts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>

        <div className="posts">
          {posts.length === 0 && <div style={{ textAlign: "center" }}>no posts found</div>}
          {posts.map((post) => {
            return <PostPreview post={post} key={post.id} />;
          })}
        </div>
      </>
    );
  } else {
    content = <Loader />;
  }

  function handleSearchSubmit(e) {
    e.preventDefault();

    const url = new URL(window.location.href);
    url.searchParams.set("search", search);
    navigate(url.pathname + url.search);
  }

  return (
    <div className="page" id="home-page">
      <div className="categories">
        <Link to="/" className={`pill ${category === null ? "active" : ""}`}>
          ALL
        </Link>

        {categories.map((cat, i) => (
          <Link to={`/?category=${cat}`} className={`pill ${category === cat ? "active" : ""}`} key={i}>
            {cat.toUpperCase()}
          </Link>
        ))}
      </div>
      {content}
    </div>
  );
}
