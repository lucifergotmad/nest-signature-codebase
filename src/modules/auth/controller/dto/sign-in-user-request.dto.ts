import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { SignInUserRequestProps } from '../../contract/auth.request.contract';

export class SignInRequestDTO implements SignInUserRequestProps {
  @IsRequiredString()
  username: string;

  @IsRequiredString()
  password: string;
}
