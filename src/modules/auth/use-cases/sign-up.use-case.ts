import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { SignUpUserRequestProps } from '../contract/auth.request.contract';
import { ResponseDTO } from 'src/core/base/http/response.dto.base';
import { IRepositoryResponse } from 'src/core/interface/repository-response.interface';
import { InjectUserRepository } from 'src/modules/user/repository/user.repository.provider';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';
import { Helpers } from 'src/helper/helper.service';
import { ResponseException } from 'src/core/exceptions/response-http-exception';
import { UserEntity } from 'src/modules/user/domain/user.entity';
import { UserLevel } from 'src/modules/user/domain/value-objects/user-level.value-object';
import { Email } from 'src/modules/user/domain/value-objects/email.value-object';

type TSignUpPayload = PickUseCasePayload<SignUpUserRequestProps, 'data'>;
type TSignUpResponse = ResponseDTO<IRepositoryResponse>;

@Injectable()
export class SignUpUser extends BaseUseCase<TSignUpPayload, TSignUpResponse> {
  constructor(
    @InjectUserRepository
    private readonly userRepository: UserRepositoryPort,
    private readonly helpers: Helpers,
  ) {
    super();
  }

  public async execute({ data }: TSignUpPayload): Promise<TSignUpResponse> {
    const session = await this.helpers.transaction.startTransaction();
    let result: IRepositoryResponse;

    try {
      await session.withTransaction(async () => {
        this._validatePassword(data);

        await this.userRepository.findOneAndThrow(
          { username: data.username },
          'Username already exists!',
          session,
        );

        await this.userRepository.findOneAndThrow(
          { email: data.email },
          'Username already exists!',
          session,
        );

        const userEntity = await UserEntity.create({
          fullname: data.fullname,
          username: data.username,
          password: data.password,
          level: new UserLevel('ADMIN'),
          email: new Email(data.email),
          created_by: data.username,
        });

        result = await this.userRepository.save(userEntity);
      });

      return new ResponseDTO({
        status: HttpStatus.CREATED,
        data: result,
        message: 'Sign up success!',
      });
    } catch (error) {
      this.logger.error(error);
      throw new ResponseException(error.message, error.status, error.trace);
    } finally {
      session.endSession();
    }
  }

  private _validatePassword(data: SignUpUserRequestProps): boolean {
    return data.password === data.confirmPassword;
  }
}
