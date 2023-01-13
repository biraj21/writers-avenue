import axios from "axios";
import DOMPurify from "dompurify";
import moment from "moment";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2 } from "react-feather";
import PostPreview from "../components/PostPreview";
import { authContext } from "../contexts/auth";
import { useAxiosGet } from "../hooks/useAxiosGet";
import "./Post.scss";

export default function Post() {
  const { id } = useParams();
  const { data: post, error } = useAxiosGet(`/posts/${id}`);
  const { currentUser } = useContext(authContext);
  const navigate = useNavigate();

  async function handleDelete(e) {
    if (!confirm("This post will be permanently deleted. Are you sure?")) {
      return;
    }

    try {
      await axios.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(err.response.data.error);
      } else {
        alert(err.message);
      }
    }
  }

  const postActionsJSX = (
    <div className="post__actions">
      <Link to="/write?edit=2" title="Edit Post">
        <Edit color="var(--primary-color)" />
      </Link>

      <button onClick={handleDelete} title="Delete Post">
        <Trash2 color="var(--red)" />
      </button>
    </div>
  );

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (post) {
    content = (
      <>
        <div className="post">
          <div className="post__category">{post.category.toUpperCase()}</div>

          <h1>{post.title}</h1>
          <img src={serverBaseUrl + post.imageUrl} alt="Thumbnail" />

          <div className="post__author">
            <img src={serverBaseUrl + post.authorAvatarUrl} alt="Avatar" className="avatar" />
            <div>
              <span>Written by {post.authorName}</span>
              <br />
              <small>{moment(post.uploadDate).fromNow()}</small>
            </div>

            {currentUser?.id === post.authorId && postActionsJSX}
          </div>

          <div
            className="post__body"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.body),
            }}
          ></div>
        </div>

        <OtherPosts category={post.category} mainPostId={post.id} />
      </>
    );
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return (
    <div className="page" id="post-page">
      {content}
    </div>
  );
}

function OtherPosts({ category, mainPostId }) {
  const { data: posts, error } = useAxiosGet(`/posts?cat=${category}`);

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (posts) {
    content = (
      <>
        {posts.length === 1 && "No other posts found in this category."}
        {posts
          .filter((post) => post.id != mainPostId)
          .map((post) => {
            const rpost = {
              ...post,
              imageUrl: serverBaseUrl + post.imageUrl,
              authorAvatarUrl: serverBaseUrl + post.authorAvatarUrl,
            };
            return <PostPreview post={rpost} key={post.id} />;
          })}
      </>
    );
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return (
    <div className="other-posts">
      <h2>Other Posts You May Like</h2>
      {content}
    </div>
  );
}
