export function processPost(post) {
  post.coverUrl = post.coverPath ? process.env.SERVER_URL + post.coverPath : null;
  post.author = {
    id: post.userId,
    name: post.userName,
    avatarUrl: process.env.SERVER_URL + post.userAvatarPath,
  };

  delete post.coverPath;
  delete post.userId;
  delete post.userName;
  delete post.userAvatarPath;
}

export function processUser(user) {
  user.avatarUrl = process.env.SERVER_URL + user.avatarPath;

  user.posts.forEach((post) => {
    post.coverUrl = post.coverPath ? process.env.SERVER_URL + post.coverPath : null;
    delete post.coverPath;
  });

  delete user.avatarPath;
}
