import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { EnvService } from 'src/infra/config/env.service';
import { AuthRefreshTokenRequestProps } from '../contract/auth.request.contract';
import { ResponseDTO } from 'src/core/base/http/response.dto.base';
import { RefreshTokenResponseProps } from '../contract/auth.response.contract';

interface IHistoryRefreshToken {
  refreshToken: string;
  expired_at: Date;
}

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
    private jwtService: JwtService,
    private envService: EnvService,
  ) {
    super();
  }

  static historyRefreshTokenList: IHistoryRefreshToken[] = [];

  async execute({ data }: TRefreshTokenPayload) {
    this._validateRefreshToken(data.refreshToken, data.username);

    const payload = { sub: data.username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: 86400,
      secret: this.envService.variables.jwtRefreshKey,
    });
    this._registerUsedRefreshToken(data.refreshToken);

    return new ResponseDTO({
      status: HttpStatus.OK,
      data: { accessToken, refreshToken: refreshToken },
    });
  }

  private _validateRefreshToken(refreshToken: string, user_id: string) {
    const tokenVerified = this._verifyJwt(refreshToken);

    if (tokenVerified?.sub != user_id) {
      throw new BadRequestException('Refresh token is not matched.');
    }

    const tokenUsed = RefreshToken.historyRefreshTokenList.find(
      (it) => it.refreshToken === refreshToken,
    );

    const isTokenUsedExpired =
      tokenUsed && tokenUsed.expired_at.getTime() < new Date().getTime();
    if (isTokenUsedExpired)
      throw new BadRequestException('Refresh Token is Expired');
  }

  private _verifyJwt(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.envService.variables.jwtRefreshKey,
      });
    } catch {
      throw new BadRequestException('Token is Not Valid');
    }
  }

  private _registerUsedRefreshToken(refreshToken: string) {
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 3);

    const isTokenExist = RefreshToken.historyRefreshTokenList.find(
      (it) => it.refreshToken === refreshToken,
    );
    if (isTokenExist) return;

    RefreshToken.historyRefreshTokenList.push({
      refreshToken: refreshToken,
      expired_at: expiredAt,
    });
  }
}
