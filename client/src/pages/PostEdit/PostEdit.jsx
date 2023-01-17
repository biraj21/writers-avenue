import { useContext } from "react";
import { useParams } from "react-router-dom";
import Loader from "components/Loader/Loader";
import PostForm from "components/PostForm/PostForm";
import { authContext } from "contexts/auth";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./PostEdit.scss";

export default function PostEdit() {
  const { id } = useParams();
  const { currentUser } = useContext(authContext);
  const { data: post, error, setError } = useAxiosGet(`/posts/${id}`);

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (post) {
    if (post.authorId !== currentUser.postId) {
      setError("You can only edit your own posts!");
    } else {
      content = <PostForm defaults={post} />;
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
