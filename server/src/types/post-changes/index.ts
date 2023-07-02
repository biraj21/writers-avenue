import { PostCategory } from "../post/index.js";

export interface IPostChanges {
  title?: string;
  body?: string;
  coverPath?: string;
  category?: PostCategory;
  postId: number;
  userId: number;
}
