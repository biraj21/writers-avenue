import axios from "axios";
import DOMPurify from "dompurify";
import moment from "moment";
import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2 } from "react-feather";
import Comment from "components/Comment/Comment";
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
    const comments = [
      {
        id: 1,
        comment:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sed tempora dolorum vitae culpa adipisci aliquid doloremque quod minima sint ullam at officiis praesentium architecto, quas iure corporis eaque nesciunt!",
        user: {
          id: 9,
          name: "Biraj",
          avatarUrl: "http://localhost:3000/uploads/1674579922954-37879496.jpeg",
        },
      },
      {
        id: 2,
        comment:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sed tempora dolorum vitae culpa adipisci aliquid doloremque quod minima sint ullam at officiis praesentium architecto, quas iure corporis eaque nesciunt!",
        user: {
          id: 9,
          name: "Biraj",
          avatarUrl: "http://localhost:3000/uploads/1674579922954-37879496.jpeg",
        },
      },
      {
        id: 3,
        comment:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sed tempora dolorum vitae culpa adipisci aliquid doloremque quod minima sint ullam at officiis praesentium architecto, quas iure corporis eaque nesciunt!",
        user: {
          id: 9,
          name: "Biraj",
          avatarUrl: "http://localhost:3000/uploads/1674579922954-37879496.jpeg",
        },
      },
      {
        id: 4,
        comment:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sed tempora dolorum vitae culpa adipisci aliquid doloremque quod minima sint ullam at officiis praesentium architecto, quas iure corporis eaque nesciunt!",
        user: {
          id: 9,
          name: "Biraj",
          avatarUrl: "http://localhost:3000/uploads/1674579922954-37879496.jpeg",
        },
      },
    ];
    content = (
      <>
        <div className="post">
          <div className="post__category">
            {post.category ? post.category : "---"}
            {post.status === "draft" && " (draft)"}
          </div>

          <h1>{post.title}</h1>
          <div className="post__cover">{post.coverUrl ? <img src={post.coverUrl} alt="Cover Image" /> : "---"}</div>

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
                {post.publishDate && `${moment(post.publishDate).fromNow()}, `}edited {moment(post.editDate).fromNow()}
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
              __html: post.body ? DOMPurify.sanitize(post.body) : "---",
            }}
          ></div>

          <PostComments comments={comments} />
        </div>

        {post.status === "pub" && <OtherPosts category={post.category} mainPostId={post.id} />}
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

function PostComments({ comments }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      if (comment.trim().length === 0) {
        throw new Error("comment cannot be empty");
      }

      setError(null);

      await axios.post("/comments", { comment: comment.trim() });
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="post__comments">
      <h2>Comments ({comments.length})</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__field">
          <textarea
            name="comment"
            rows={3}
            defaultValue={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <button className="btn" disabled={isSubmitting}>
          Submit
        </button>
      </form>

      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
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
        {posts.length === 1 && "no other posts found in this category"}
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
