export interface UpdateUserRequestProps {
  fullname: string;
  email: string;
  level: string;
}

export interface CreateUserRequestProps {
  level?: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
}
