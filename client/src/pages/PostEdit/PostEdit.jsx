import { useParams } from "react-router-dom";
import Loader from "components/Loader/Loader";
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
    content = <Loader />;
  }

  return (
    <div className="page" id="post-edit-page">
      <h1>Edit Post</h1>
      {content}
    </div>
  );
}
