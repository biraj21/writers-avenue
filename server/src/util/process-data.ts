export function processComment(comment: any) {
  const user: any = {
    id: comment.userId,
    name: comment.userName,
  };

  if (comment.userAuthMethod === "email") {
    user.avatarUrl = process.env.SERVER_URL + comment.userAvatarPath;
  } else if (comment.userAuthMethod === "google") {
    user.avatarUrl = comment.userAvatarPath;
  }

  comment.user = user;

  delete comment.userId;
  delete comment.userName;
  delete comment.userAvatarPath;
  delete comment.userAuthMethod;
}

export function processPost(post: any) {
  post.coverUrl = post.coverPath ? process.env.SERVER_URL + post.coverPath : null;
  const user: any = {
    id: post.userId,
    name: post.userName,
  };

  if (post.userAuthMethod === "email") {
    user.avatarUrl = process.env.SERVER_URL + post.userAvatarPath;
  } else if (post.userAuthMethod === "google") {
    user.avatarUrl = post.userAvatarPath;
  }

  post.user = user;

  delete post.coverPath;
  delete post.userId;
  delete post.userName;
  delete post.userAvatarPath;
  delete post.authMethod;
}

export function processPostChanges(postChanges: any) {
  postChanges.id = postChanges.postId;
  postChanges.coverUrl = postChanges.coverPath ? process.env.SERVER_URL + postChanges.coverPath : null;
  postChanges.user = {
    id: postChanges.userId,
  };

  delete postChanges.postId;
  delete postChanges.coverPath;
  delete postChanges.userId;
}

export function processUser(user: any) {
  if (user.authMethod === "email") {
    user.avatarUrl = process.env.SERVER_URL + user.avatarPath;
  } else if (user.authMethod === "google") {
    user.avatarUrl = user.avatarPath;
  }

  user.posts.forEach((post: any) => {
    post.coverUrl = post.coverPath ? process.env.SERVER_URL + post.coverPath : null;
    delete post.coverPath;
  });

  delete user.avatarPath;
  delete user.password;
}
