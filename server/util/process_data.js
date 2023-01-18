export function processPost(post) {
  post.coverUrl = process.env.SERVER_URL + post.coverPath;
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
    post.coverUrl = process.env.SERVER_URL + post.coverPath;
    delete post.coverPath;
  });

  delete user.avatarPath;
}
