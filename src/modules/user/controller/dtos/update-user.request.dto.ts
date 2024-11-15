import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { UpdateUserRequestProps } from '../../contract/user.request.contract';
import { IsRequiredBoolean } from 'src/core/decorator/required-boolean.decorator';

export class UpdateUserRequestDTO implements UpdateUserRequestProps {
  @IsRequiredString()
  username: string;

  @IsRequiredString()
  password: string;

  @IsRequiredString()
  firstname: string;

  @IsRequiredString()
  lastname: string;

  @IsRequiredString()
  fullname: string;

  @IsRequiredString()
  email: string;

  @IsRequiredBoolean()
  is_2fa_enabled: boolean;

  @IsRequiredBoolean()
  is_email_verified: boolean;
}
