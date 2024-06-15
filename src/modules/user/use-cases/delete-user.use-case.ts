import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDTO } from 'src/core/base/http/response.dto.base';
import {
  BaseUseCase,
  IUseCasePayload,
} from 'src/core/base/module/use-case.base';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';
import { ITransactionService } from 'src/helper/modules/transaction/transaction.interface';
import { ResponseException } from 'src/core/exceptions/response-http-exception';

type TDeleteUserPayload = Pick<IUseCasePayload<never>, '_id'>;
type TDeleteUserResponse = ResponseDTO;

@Injectable()
export class DeleteUser extends BaseUseCase<
  TDeleteUserPayload,
  TDeleteUserResponse
> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    private readonly transactionService: ITransactionService,
  ) {
    super();
  }

  public async execute({ _id }: TDeleteUserPayload): Promise<ResponseDTO> {
    const session = await this.transactionService.startTransaction();

    try {
      await session.withTransaction(async () => {
        await this.userRepository.delete({ _id }, session);
      });

      return new ResponseDTO({
        status: HttpStatus.OK,
        message: `${_id} documents deleted!`,
      });
    } catch (err) {
      this.logger.error(err);
      throw new ResponseException(err.message, err.status, err.trace);
    } finally {
      session.endSession();
    }
  }
}
