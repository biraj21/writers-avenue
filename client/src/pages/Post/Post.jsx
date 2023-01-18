import axios from "axios";
import DOMPurify from "dompurify";
import moment from "moment";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2 } from "react-feather";
import Loader from "components/Loader/Loader";
import PostPreview from "components/PostPreview/PostPreview";
import { authContext } from "contexts/auth";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./Post.scss";

export default function Post() {
  const { id } = useParams();
  const { data: post, error } = useAxiosGet(`/posts/${id}`);
  const { currentUser } = useContext(authContext);
  const navigate = useNavigate();

  async function handleDelete() {
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

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (post) {
    content = (
      <>
        <div className="post">
          <div className="post__category">{post.category.toUpperCase()}</div>

          <h1>{post.title}</h1>
          <img src={post.coverUrl} alt="Cover Image" />

          <div className="post__author">
            <Link to={`/users/${post.author.id}`}>
              <img src={post.author.avatarUrl} alt="Avatar" className="avatar" />
            </Link>
            <div>
              <span>
                Written by <Link to={`/users/${post.author.id}`}>{post.author.name}</Link>
              </span>
              <br />
              <small>
                {moment(post.publishDate).fromNow()}, edited {moment(post.editDate).fromNow()}
              </small>
            </div>

            {currentUser?.id === post.author.id && (
              <div className="post__actions">
                <Link to={`/edit/${post.id}`} title="Edit Post">
                  <Edit color="var(--primary-color)" />
                </Link>

                <button onClick={handleDelete} title="Delete Post">
                  <Trash2 color="var(--red)" />
                </button>
              </div>
            )}
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
    content = <Loader />;
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
            return <PostPreview post={post} key={post.id} />;
          })}
      </>
    );
  } else {
    content = <Loader />;
  }

  return (
    <div className="other-posts">
      <h2>Other Posts You May Like</h2>
      {content}
    </div>
  );
}
