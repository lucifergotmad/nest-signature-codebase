import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { EnvService } from 'src/infra/config/env.service';
import { AuthRefreshTokenRequestProps } from '../contract/auth.request.contract';
import { ResponseDTO } from 'src/core/base/http/response.dto.base';
import { RefreshTokenResponseProps } from '../contract/auth.response.contract';
import { CacheKeyList } from 'src/core/constant/app/cache/cache-key.const';
import { Helpers } from 'src/helper/helper.service';

type TRefreshTokenPayload = PickUseCasePayload<
  AuthRefreshTokenRequestProps,
  'data'
>;
type TRefreshTokenResponse = ResponseDTO<RefreshTokenResponseProps>;

@Injectable()
export class RefreshToken extends BaseUseCase<
  TRefreshTokenPayload,
  TRefreshTokenResponse
> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly helpers: Helpers,
  ) {
    super();
  }

  async execute({ data }: TRefreshTokenPayload) {
    this._validateRefreshToken(data.refreshToken, data.username);

    const payload = { sub: data.username };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.envService.variables.jwtLimit,
      secret: this.envService.variables.jwtSecretKey,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.envService.variables.jwtRefreshKey,
    });

    await this._deleteCachedToken(data.username);
    await this._cacheToken(data.username, accessToken, refreshToken);

    return new ResponseDTO({
      status: HttpStatus.OK,
      data: { accessToken, refreshToken },
      message: 'Refresh token success!',
    });
  }

  private async _validateRefreshToken(refreshToken: string, username: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.envService.variables.jwtRefreshKey,
      });

      if (payload?.sub !== username) {
        throw new UnauthorizedException('Invalid refresh token!');
      }

      const cachedToken = await this.helpers.cache.get<string>(
        `${CacheKeyList.REFRESH_TOKEN}`,
      );

      if (!cachedToken || cachedToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token is expired or invalid!');
      }
    } catch (error) {
      throw new UnauthorizedException('Refresh token validation failed!');
    }
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
    // Cache the access token with a short TTL
    await this.helpers.cache.set(
      `${CacheKeyList.ACCESS_TOKEN}:${username}`,
      accessToken,
      15 * 60 * 1000, // 15 minutes in milliseconds
    );

    // Cache the refresh token with a longer TTL
    await this.helpers.cache.set(
      `${CacheKeyList.REFRESH_TOKEN}:${username}`,
      refreshToken,
      7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    );
  }
}
