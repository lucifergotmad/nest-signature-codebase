export interface AuthRefreshTokenRequestProps {
  username: string;
  refreshToken: string;
}
export interface SignInUserRequestProps {
  username: string;
  password: string;
}

export interface SignUpUserRequestProps {
  fullname: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterSuperUserRequestProps {
  fullname: string;
  email: string;
  username: string;
  password: string;
}
