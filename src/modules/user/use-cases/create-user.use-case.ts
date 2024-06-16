import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ResponseDTO } from 'src/core/base/http/response.dto.base';
import { BaseUseCase } from 'src/core/base/module/use-case.base';

import { EnvService } from 'src/infra/config/env.service';
import { UserRepositoryPort } from '../repository/user.repository.port';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserEntity } from '../domain/user.entity';
import { UserLevel } from '../domain/value-objects/user-level.value-object';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { SHA256 } from 'crypto-js';
import { OptionalSecretKeyProps } from 'src/core/contract/optional-secret-key.request.contract';
import { CreateUserRequestProps } from '../contract/user.request.contract';
import { IRepositoryResponse } from 'src/core/interface/repository-response.interface';
import { ClientSession } from 'mongoose';
import { Helpers } from 'src/helper/helper.service';

type TCreateUserPayload = PickUseCasePayload<
  CreateUserRequestProps & OptionalSecretKeyProps,
  'data' | 'user'
>;
type TCreateUserResponse = ResponseDTO<IRepositoryResponse>;

@Injectable()
export class CreateUser extends BaseUseCase<
  TCreateUserPayload,
  TCreateUserResponse
> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    private readonly envService: EnvService,
    private readonly helpers: Helpers,
  ) {
    super();
  }

  public async execute({ data, user }: TCreateUserPayload) {
    const session = await this.helpers.transaction.startTransaction();
    let result: IRepositoryResponse;

    try {
      await session.withTransaction(async () => {
        await this.userRepository.findOneAndThrow(
          { username: data.username },
          'User already exists!',
          session,
        );

        const isSecretKeyValid = await this._validateSecretKey(data.secretKey);
        const level = await this._generateUserLevel(
          isSecretKeyValid,
          data?.level,
        );

        const userEntity = await UserEntity.create({
          username: data.username,
          password: data.password,
          level: level,
          input_by: user?.user_id,
        });

        result = await this.userRepository.save(userEntity);
      });

      return new ResponseDTO({ status: HttpStatus.CREATED, data: result });
    } catch (err) {
      this.logger.error(err);

      throw new HttpException(
        { message: err.message || err },
        err.message.includes('exists')
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }

  private async _validateSecretKey(secretKey: string) {
    const systemSecretKey = SHA256(
      this.envService.variables.secretKey,
    ).toString();
    const isSecretKeyValid = secretKey && secretKey === systemSecretKey;

    if (secretKey && !isSecretKeyValid) {
      throw new BadRequestException('Wrong Key Input. Transaction aborted.');
    }

    return isSecretKeyValid || false;
  }

  private async _generateUserLevel(
    isSecretKeyValid: boolean,
    level: string,
    session?: ClientSession,
  ) {
    if (isSecretKeyValid) {
      await this.userRepository.findOneAndThrow(
        { level: 'SU' },
        'Level System Sudah Terdaftar.',
        session,
      );
    }

    return isSecretKeyValid ? new UserLevel('SU') : new UserLevel(level!);
  }
}
