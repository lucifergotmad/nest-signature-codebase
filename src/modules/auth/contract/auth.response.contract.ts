export interface SignInUserResponseProps {
  accessToken: string;
  refreshToken: string;
  level: string;
  username: string;
  fullname: string;
  email: string;
}

export interface RefreshTokenResponseProps {
  accessToken: string;
  refreshToken: string;
}
