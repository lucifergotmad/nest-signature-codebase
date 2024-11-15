export interface UpdateUserRequestProps {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  is_2fa_enabled: boolean;
  is_email_verified: boolean;
}

export interface CreateUserRequestProps {
  role?: string;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  password: string;
}
