import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { LoginRequestDTO } from './dto/login-user-request.dto';
import { LoginUser } from '../use-case/login.use-case';
import { CreateUser } from 'src/modules/user/use-cases/create-user.use-case';
import { RegisterUserRequestDTO } from './dto/register-user-request.dto';
import { AuthRefreshTokenRequestDTO } from 'src/modules/auth/controller/dto/auth-refresh-token.dto';
import { RefreshToken } from '../use-case/refresh-token.use-case';
@Controller('v1/auth')
export class AuthController {
  constructor(
    readonly loginUser: LoginUser,
    readonly createUser: CreateUser,
    readonly refreshToken: RefreshToken,
  ) {}

  @Post('register-su')
  async createUserHandler(
    @Body() body: RegisterUserRequestDTO,
    @Headers('secret-key') secretKey: string, // client secret key must be hashed in SHA256
  ) {
    if (!secretKey) throw new BadRequestException('Secret key is required');

    return this.createUser.execute({
      data: { ...body, secretKey },
      user: { username: 'SYSTEM' },
    });
  }

  @Post('login')
  async loginUserHandler(@Body() body: LoginRequestDTO) {
    return this.loginUser.execute({ data: body });
  }

  @Post('refresh')
  async refreshTokenHandler(@Body() body: AuthRefreshTokenRequestDTO) {
    return this.refreshToken.execute({ data: body });
  }
}
