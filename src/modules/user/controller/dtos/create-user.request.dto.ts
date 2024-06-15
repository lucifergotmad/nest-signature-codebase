import { IsString } from 'class-validator';
import { RegisterUserRequestDTO } from 'src/modules/auth/controller/dto/register-user-request.dto';
import { CreateUserRequestProps } from '../../contract/user.request.contract';

export class CreateUserRequestDTO
  extends RegisterUserRequestDTO
  implements CreateUserRequestProps
{
  @IsString()
  level?: string;
}
