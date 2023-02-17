import axios from "axios";
import DOMPurify from "dompurify";
import moment from "moment";
import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit, Heart, Trash2 } from "react-feather";
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
    content = (
      <>
        <div className="post">
          {post.hasChanges && (
            <Link to={`/posts/changes/${id}`} className="btn post__other-version">
              Go to draft version
            </Link>
          )}

          <div className="post__category">
            {post.category ? post.category : "---"}
            {post.status === "draft" && " (draft)"}
          </div>

          <h1>{post.title}</h1>
          <div className="post__cover">{post.coverUrl ? <img src={post.coverUrl} alt="Cover Image" /> : "---"}</div>

          <div className="post__author">
            <Link to={`/users/${post.user.id}`}>
              <img src={post.user.avatarUrl} alt="Avatar" className="avatar" />
            </Link>
            <div>
              <span>
                Written by <Link to={`/users/${post.user.id}`}>{post.user.name}</Link>
              </span>
              <br />
              <small>
                {post.publishDate && `${moment(post.publishDate).format("MMM Do YYYY")}, `}edited on{" "}
                {moment(post.editData).format("MMM Do YYYY")}
              </small>
            </div>

            {currentUser?.id === post.user.id && (
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

          <PostLike postId={post.id} liked={post.likedByMe} likeCount={post.likeCount} />

          <PostComments postId={post.id} />
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

function PostLike({ postId, liked: likedByMe, likeCount }) {
  const { currentUser } = useContext(authContext);
  const [liked, setLiked] = useState(likedByMe);
  if (likedByMe && !liked) {
    likeCount -= 1;
  } else if (!likedByMe && liked) {
    likeCount += 1;
  }

  async function handeClick() {
    try {
      if (!currentUser) {
        alert("you need to be logged in!");
        return;
      }

      setLiked(!liked);
      await axios.put(`/likes/${postId}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="post__likes">
      <button className={`btn ${liked ? "" : "btn--stroked"}`} onClick={handeClick}>
        <Heart width={18} />
        {liked ? "Liked" : "Like"}
      </button>
      {likeCount} likes
    </div>
  );
}

function PostComments({ postId }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(authContext);
  const { data: comments, setData: setComments, error: dataError } = useAxiosGet(`/comments/${postId}`);

  async function handleDelete(commentId) {
    try {
      if (!confirm("This comment will be deleted. Are you sure?")) {
        return;
      }

      await axios.delete(`/comments/${commentId}`);
      setComment("");
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    }
  }

  let content;
  if (error) {
    content = <div className="error-msg">{dataError}</div>;
  } else if (comments) {
    content = (
      <>
        {currentUser ? (
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
        ) : (
          <div style={{ textAlign: "center" }}>
            <Link to="/login">Login</Link> to comment.
          </div>
        )}
        {comments.map((comment) => (
          <Comment
            comment={comment}
            key={comment.id}
            handleDelete={comment.user.id === currentUser?.id && handleDelete}
          />
        ))}
      </>
    );
  } else {
    content = <Loader />;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      if (comment.trim().length === 0) {
        throw new Error("comment cannot be empty");
      }

      setError(null);

      const res = await axios.post("/comments", { comment: comment.trim(), postId });
      const newComment = {
        id: res.data.data,
        body: comment.trim(),
        postId,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          avatarUrl: currentUser.avatarUrl,
        },
      };
      setComments([...comments, newComment]);
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
      <h2>Comments {comments && `(${comments.length})`}</h2>
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
