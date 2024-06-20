import { CreateUserRequestProps } from '../../contract/user.request.contract';
import { RegisterSuperUserRequestDTO } from 'src/modules/auth/controller/dto/register-super-user-request.dto';
import { IsOptionalString } from 'src/core/decorator/optional-string.decorator';

export class CreateUserRequestDTO
  extends RegisterSuperUserRequestDTO
  implements CreateUserRequestProps
{
  @IsOptionalString()
  level?: string;
}
