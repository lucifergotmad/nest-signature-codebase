import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { SignInUserRequestProps } from '../../contract/auth.request.contract';

export class SignInRequestDTO implements SignInUserRequestProps {
  @IsRequiredString()
  email: string;

  @IsRequiredString()
  password: string;
}
