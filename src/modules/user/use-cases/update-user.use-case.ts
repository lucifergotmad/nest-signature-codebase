import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { InjectUserRepository } from '../repository/user.repository.provider';

import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { ResponseDTO } from 'src/core/base/http/response.dto.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';
import { UpdateUserRequestProps } from '../contract/user.request.contract';
import { ResponseException } from 'src/core/exceptions/response-http-exception';
import { Helpers } from 'src/helper/helper.service';

type TUpdateUserPayload = PickUseCasePayload<
  UpdateUserRequestProps,
  'data' | '_id'
>;
type TUpdateUserResponse = ResponseDTO;

@Injectable()
export class UpdateUser extends BaseUseCase<
  TUpdateUserPayload,
  TUpdateUserResponse
> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    private readonly helpers: Helpers,
  ) {
    super();
  }

  async execute({ data, _id }: TUpdateUserPayload) {
    const session = await this.helpers.transaction.startTransaction();

    try {
      await session.withTransaction(async () => {
        const userEntity = await this.userRepository.findById(
          new ObjectIdVO(_id).valueConverted,
          session,
        );
        if (!userEntity) throw new NotFoundException('User not found!');

        userEntity.updateUser(data);

        await this.userRepository.updateOne(
          { _id: userEntity.propsCopy._id },
          userEntity,
          session,
        );
      });

      return new ResponseDTO({
        status: HttpStatus.OK,
        message: `${_id} documents updated`,
      });
    } catch (err) {
      this.logger.error(err);
      throw new ResponseException(err.message, err.status, err.trace);
    } finally {
      session.endSession();
    }
  }
}
