import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { RegisterUserRequestProps } from '../../contract/auth.request.contract';

export class RegisterUserRequestDTO implements RegisterUserRequestProps {
  @IsRequiredString()
  username: string;

  @IsRequiredString()
  password: string;
}
