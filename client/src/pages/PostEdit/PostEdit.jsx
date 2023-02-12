import axios from "axios";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "components/Loader/Loader";
import PostForm from "components/PostForm/PostForm";
import { authContext } from "contexts/auth";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./PostEdit.scss";

export default function PostEdit() {
  const { id } = useParams();
  const { currentUser } = useContext(authContext);
  const [changes, setChanges] = useState(true);
  const { data: post, setData, error, setError } = useAxiosGet(`/posts/changes/${id}`);

  async function loadPost() {
    try {
      const res = await axios.get(`/posts/${id}`);
      setData(res.data.data);
      setError(null);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    }
  }

  let content;
  if (error) {
    if (error === "not found" && changes) {
      setError(null);
      setChanges(false);
      loadPost();
    } else {
      content = <div className="error-msg">{error}</div>;
    }
  } else if (post) {
    if (post.user.id !== currentUser.id) {
      setError("You can only edit your own posts!");
    } else {
      content = <PostForm defaults={post} changes={changes} />;
    }
  } else {
    content = <Loader />;
  }

  return (
    <div className="page" id="post-edit-page">
      <h1>Edit Post</h1>
      {content}
    </div>
  );
}
