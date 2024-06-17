import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDTO } from 'src/core/base/http/response.dto.base';
import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';

import { EnvService } from 'src/infra/config/env.service';
import { InjectUserRepository } from 'src/modules/user/repository/user.repository.provider';
import { UserEntity } from 'src/modules/user/domain/user.entity';
import { UserRepositoryPort } from '../../user/repository/user.repository.port';
import { UserMapper } from 'src/modules/user/domain/user.mapper';
import { SignInUserRequestProps } from '../contract/auth.request.contract';
import { SignInUserResponseProps } from '../contract/auth.response.contract';

type TSignInPayload = PickUseCasePayload<SignInUserRequestProps, 'data'>;
type TSignInResponse = ResponseDTO<SignInUserResponseProps>;

@Injectable()
export class SignInUser extends BaseUseCase<TSignInPayload, TSignInResponse> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {
    super();
  }

  public async execute({ data }: TSignInPayload) {
    const userData = await this.userRepository.findOneOrThrow(
      { username: data.username },
      'Username atau password salah.',
    );

    const userProps = userData.propsCopy;
    const passwordMatch = await UserEntity.comparePassword(
      data.password,
      userProps.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Username or Password is Incorrect.');
    }

    const jwtPayload = {
      sub: userProps.username,
    };

    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.envService.variables.jwtLimit,
      secret: this.envService.variables.jwtRefreshKey,
    });

    const userObject = UserMapper.toPlainObject(userData);
    return new ResponseDTO({
      status: HttpStatus.OK,
      data: {
        accessToken,
        refreshToken,
        level: userObject.level,
        username: userObject.username,
      },
      message: 'Log in success!',
    });
  }
}
