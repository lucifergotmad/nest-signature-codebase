export interface AuthRefreshTokenRequestProps {
  username: string;
  refreshToken: string;
}
export interface SignInUserRequestProps {
  username: string;
  password: string;
}

export interface SignUpUserRequestProps {
  username: string;
  password: string;
  confirmPassword: string;
}
export interface RegisterSuperUserRequestProps {
  username: string;
  password: string;
}
