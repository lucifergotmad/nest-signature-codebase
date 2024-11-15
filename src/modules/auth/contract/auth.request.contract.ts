export interface AuthRefreshTokenRequestProps {
  username: string;
  refreshToken: string;
}
export interface SignInUserRequestProps {
  email: string;
  password: string;
}

export interface SignUpUserRequestProps {
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterSuperUserRequestProps {
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  username: string;
  password: string;
}
