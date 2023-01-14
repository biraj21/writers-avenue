import { useContext } from "react";
import { useParams } from "react-router-dom";
import PostForm from "components/PostForm/PostForm";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./PostEdit.scss";

export default function PostEdit() {
  const { id } = useParams();
  const { data: post, error } = useAxiosGet(`/posts/${id}`);

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (post) {
    content = <PostForm defaults={post} />;
  } else {
    content = <h3 className="loading-msg">Loading...</h3>;
  }

  return (
    <div className="page" id="post-edit-page">
      <h1>Edit Post</h1>
      {content}
    </div>
  );
}
