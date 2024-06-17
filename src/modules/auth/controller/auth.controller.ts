import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { SignInRequestDTO } from './dto/sign-in-user-request.dto';
import { SignInUser } from '../use-cases/sign-in.use-case';
import { CreateUser } from 'src/modules/user/use-cases/create-user.use-case';
import { RegisterSuperUserRequestDTO } from './dto/register-super-user-request.dto';
import { AuthRefreshTokenRequestDTO } from 'src/modules/auth/controller/dto/auth-refresh-token.dto';
import { RefreshToken } from '../use-cases/refresh-token.use-case';
import { SignUpRequestDTO } from './dto/sign-up-user.request.dto';
import { SignUpUser } from '../use-cases/sign-up.use-case';
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly signInUser: SignInUser,
    private readonly signUpUser: SignUpUser,
    private readonly createUser: CreateUser,
    private readonly refreshToken: RefreshToken,
  ) {}

  /**
   * @param body: RegisterSuperUserRequestDTO
   * @param secretKey: String (Must be hashed in SHA256)
   * @returns ResponseDTO
   */
  @Post('register-su')
  async createUserHandler(
    @Body() body: RegisterSuperUserRequestDTO,
    @Headers('secret-key') secretKey: string,
  ) {
    if (!secretKey) throw new BadRequestException('Secret key is required');

    return this.createUser.execute({
      data: { ...body, secretKey },
      user: { username: 'SYSTEM' },
    });
  }

  @Post('sign-in')
  async signInUserHandler(@Body() body: SignInRequestDTO) {
    return this.signInUser.execute({ data: body });
  }

  @Post('sign-up')
  async signUpUserHandler(@Body() body: SignUpRequestDTO) {
    return this.signUpUser.execute({ data: body });
  }

  @Post('refresh')
  async refreshTokenHandler(@Body() body: AuthRefreshTokenRequestDTO) {
    return this.refreshToken.execute({ data: body });
  }
}
