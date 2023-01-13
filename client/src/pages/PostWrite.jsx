import PostForm from "../components/PostForm";
import "./PostWrite.scss";

export default function PostWrite() {
  return (
    <div className="page" id="post-write-page">
      <h1>New Blog</h1>
      <PostForm />
    </div>
  );
}
