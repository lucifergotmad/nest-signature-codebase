export interface SignInUserResponseProps {
  accessToken: string;
  refreshToken: string;
  level: string;
  username: string;
}

export interface RefreshTokenResponseProps {
  accessToken: string;
  refreshToken: string;
}
