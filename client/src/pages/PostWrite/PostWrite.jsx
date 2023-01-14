import PostForm from "components/PostForm/PostForm";
import "./PostWrite.scss";

export default function PostWrite() {
  return (
    <div className="page" id="post-write-page">
      <h1>New Post</h1>
      <PostForm />
    </div>
  );
}
