import { IsRequiredString } from 'src/core/decorator/required-string.decorator';
import { AuthRefreshTokenRequestProps } from '../../contract/auth.request.contract';

export class AuthRefreshTokenRequestDTO
  implements AuthRefreshTokenRequestProps
{
  @IsRequiredString()
  username: string;

  @IsRequiredString()
  refreshToken: string;
}
