import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { RegisterSuperUserRequestProps } from '../../contract/auth.request.contract';

export class RegisterSuperUserRequestDTO
  implements RegisterSuperUserRequestProps
{
  @IsRequiredString()
  fullname: string;

  @IsRequiredString()
  email: string;

  @IsRequiredString()
  username: string;

  @IsRequiredString()
  password: string;
}
