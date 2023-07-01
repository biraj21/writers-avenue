export type UserAuthMethod = "email" | "google";

export interface IUser {
  readonly id?: number;
  name: string;
  email: string;
  password?: string;
  avatarPath: string;
  authMethod?: UserAuthMethod;
}
