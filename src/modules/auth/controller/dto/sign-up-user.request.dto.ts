import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { SignUpUserRequestProps } from '../../contract/auth.request.contract';

export class SignUpRequestDTO implements SignUpUserRequestProps {
  @IsRequiredString()
  username: string;

  @IsRequiredString()
  password: string;

  @IsRequiredString()
  confirmPassword: string;
}
