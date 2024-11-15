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
import { CacheKeyList } from 'src/core/constant/app/cache/cache-key.const';
import { Helpers } from 'src/helper/helper.service';

type TSignInPayload = PickUseCasePayload<SignInUserRequestProps, 'data'>;
type TSignInResponse = ResponseDTO<SignInUserResponseProps>;

@Injectable()
export class SignInUser extends BaseUseCase<TSignInPayload, TSignInResponse> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly helpers: Helpers,
  ) {
    super();
  }

  public async execute({ data }: TSignInPayload) {
    const userData = await this.userRepository.findOneOrThrow(
      { email: data.email },
      'Email or Password is Incorrect!',
    );

    const userProps = userData.propsCopy;
    const passwordMatch = await UserEntity.comparePassword(
      data.password,
      userProps.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Email or Password is Incorrect!');
    }

    const jwtPayload = {
      sub: userProps.username,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.envService.variables.jwtLimit,
      secret: this.envService.variables.jwtSecretKey,
    });
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: '7d',
      secret: this.envService.variables.jwtRefreshKey,
    });

    await this._deleteCachedToken(userProps.username);
    await this._cacheToken(userProps.username, accessToken, refreshToken);

    const userObject = UserMapper.toPlainObject(userData);
    return new ResponseDTO({
      status: HttpStatus.OK,
      data: {
        accessToken,
        refreshToken,
        role: userObject.role,
        username: userObject.username,
        fullname: userObject.fullname,
        email: userObject.email,
      },
      message: 'Log in success!',
    });
  }

  private async _deleteCachedToken(username: string) {
    await this.helpers.cache.delete(`${CacheKeyList.ACCESS_TOKEN}:${username}`);
    await this.helpers.cache.delete(
      `${CacheKeyList.REFRESH_TOKEN}:${username}`,
    );
  }

  private async _cacheToken(
    username: string,
    accessToken: string,
    refreshToken: string,
  ) {
    await this.helpers.cache.set(
      `${CacheKeyList.ACCESS_TOKEN}:${username}`,
      accessToken,
      15 * 60 * 1000,
    );

    await this.helpers.cache.set(
      `${CacheKeyList.REFRESH_TOKEN}:${username}`,
      refreshToken,
      7 * 24 * 60 * 60 * 1000,
    );
  }
}
