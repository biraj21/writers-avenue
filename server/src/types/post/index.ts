export type PostCategory = "art" | "business" | "cinema" | "food" | "science" | "technology";

export type PostStatus = "pub" | "pvt" | "draft";

export interface IPost {
  readonly id: number;
  title: string;
  body?: string;
  coverPath?: string;
  category?: PostCategory;
  publishDate: Date;
  editDate?: Date;
  status?: PostStatus;
  userId: number;
}
