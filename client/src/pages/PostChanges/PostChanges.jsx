import axios from "axios";
import DOMPurify from "dompurify";
import moment from "moment";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2 } from "react-feather";
import Loader from "components/Loader/Loader";
import { authContext } from "contexts/auth";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./PostChanges.scss";

export default function PostChanges() {
  const { id } = useParams();
  const { data: postChanges, error } = useAxiosGet(`/posts/changes/${id}`);
  const { currentUser } = useContext(authContext);
  const navigate = useNavigate();

  async function handleDelete() {
    if (!confirm("This changes in this post will be permanently deleted. Are you sure?")) {
      return;
    }

    try {
      await axios.delete(`/posts/changes/${id}`);
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
  } else if (postChanges) {
    content = (
      <div className="post">
        <div className="post__category">{postChanges.category ? postChanges.category : "---"}</div>

        <h1>{postChanges.title}</h1>
        <div className="post__cover">
          {postChanges.coverUrl ? <img src={postChanges.coverUrl} alt="Cover Image" /> : "---"}
        </div>

        <div className="post__author">
          <Link to={`/users/${currentUser.id}`}>
            <img src={currentUser.avatarUrl} alt="Avatar" className="avatar" />
          </Link>
          <div>
            <span>
              Written by <Link to={`/users/${currentUser.id}`}>{currentUser.name}</Link>
            </span>
            <br />
            <small>
              {postChanges.publishDate && `${moment(postChanges.publishDate).format("MMM Do YYYY")}, `}edited{" "}
              {moment(postChanges.editData).format("MMM Do YYYY")}
            </small>
          </div>

          <div className="post__actions">
            <Link to={`/edit/${postChanges.id}`} title="Edit">
              <Edit color="var(--primary-color)" />
            </Link>

            <button onClick={handleDelete} title="Delete Changes">
              <Trash2 color="var(--red)" />
            </button>
          </div>
        </div>

        <div
          className="post__body"
          dangerouslySetInnerHTML={{
            __html: postChanges.body ? DOMPurify.sanitize(postChanges.body) : "---",
          }}
        ></div>
      </div>
    );
  } else {
    content = <Loader />;
  }

  return (
    <div className="page" id="post-changes-page">
      {content}
    </div>
  );
}
