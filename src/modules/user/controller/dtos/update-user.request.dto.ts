import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { UpdateUserRequestProps } from '../../contract/user.request.contract';

export class UpdateUserRequestDTO implements UpdateUserRequestProps {
  @IsRequiredString()
  fullname: string;

  @IsRequiredString()
  email: string;

  @IsRequiredString()
  level: string;
}
