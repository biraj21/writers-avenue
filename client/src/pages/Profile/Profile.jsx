import { useParams } from "react-router-dom";
import { useAxiosGet } from "hooks/useAxiosGet";
import Loader from "components/Loader/Loader";
import PostPreview from "components/PostPreview/PostPreview";
import "./Profile.scss";

export default function Profile() {
  const { id } = useParams();
  const { data: user, error } = useAxiosGet(`/users/${id}`);

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (user) {
    content = (
      <div className="user">
        <div className="user__info">
          <img src={serverBaseUrl + user.imageUrl} alt="Avatar" className="avatar user__avatar" />
          <h2 className="user__name">{user.name}</h2>
          <span>{user.posts.length} posts published</span>
        </div>

        <div className="user__posts">
          <h3>{user.name.split(/\s+/)[0]}'s Posts</h3>

          {user.posts.map((post) => {
            const rpost = { ...post, imageUrl: serverBaseUrl + post.imageUrl };
            return <PostPreview post={rpost} key={post.id} />;
          })}
        </div>
      </div>
    );
  } else {
    content = <Loader />;
  }

  return (
    <div className="page" id="profile-page">
      {content}
    </div>
  );
}
