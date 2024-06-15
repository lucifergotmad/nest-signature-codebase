import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDTO } from 'src/core/base/http/response.dto.base';
import {
  BaseUseCase,
  IUseCasePayload,
} from 'src/core/base/module/use-case.base';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';

type TDeleteUserPayload = Pick<IUseCasePayload<never>, '_id'>;
type TDeleteUserResponse = ResponseDTO;

@Injectable()
export class DeleteUser extends BaseUseCase<
  TDeleteUserPayload,
  TDeleteUserResponse
> {
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
  ) {
    super();
  }

  public async execute({ _id }: TDeleteUserPayload): Promise<ResponseDTO> {
    try {
      await this.userRepository.delete({ _id });
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, 500);
    }
    return new ResponseDTO({
      status: HttpStatus.OK,
      message: `${_id} documents deleted!`,
    });
  }
}
