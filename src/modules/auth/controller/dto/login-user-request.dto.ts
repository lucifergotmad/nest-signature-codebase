import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { LoginUserRequestProps } from '../../contract/auth.request.contract';

export class LoginRequestDTO implements LoginUserRequestProps {
  @IsRequiredString()
  username: string;

  @IsRequiredString()
  password: string;
}
