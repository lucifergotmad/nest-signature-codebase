import { Provider } from '@nestjs/common';
import { SignInUser } from './sign-in.use-case';
import { RefreshToken } from './refresh-token.use-case';
import { SignUpUser } from './sign-up.use-case';

export const authUseCaseProvider: Provider[] = [
  SignInUser,
  SignUpUser,
  RefreshToken,
];
