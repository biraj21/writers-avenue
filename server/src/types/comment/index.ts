export interface IComment {
  readonly id?: number;
  body: string;
  postId: number;
  userId: number;
  date?: Date;
}
