import { IsString } from 'class-validator';
import { CreateUserRequestProps } from '../../contract/user.request.contract';
import { RegisterSuperUserRequestDTO } from 'src/modules/auth/controller/dto/register-super-user-request.dto';

export class CreateUserRequestDTO
  extends RegisterSuperUserRequestDTO
  implements CreateUserRequestProps
{
  @IsString()
  level?: string;
}
