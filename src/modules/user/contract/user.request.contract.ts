export interface UpdateUserRequestProps {
  username: string;
  level: string;
}
export interface CreateUserRequestProps {
  level?: string;
  username: string;
  password: string;
}
