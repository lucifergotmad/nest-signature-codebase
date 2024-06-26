import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CustomLogger } from 'src/infra/logger/logger';

export interface JwtDecoded {
  username?: string;
}

export interface IUseCasePayload<T> {
  _id: string;
  data: T;
  user: JwtDecoded;
}

export interface IUseCase<IReq, IRes> {
  execute(request?: IReq, session?: ClientSession): IRes | Promise<IRes>;
}

@Injectable()
export abstract class BaseUseCase<IReq, IRes> implements IUseCase<IReq, IRes> {
  protected logger: CustomLogger;

  constructor() {
    this.logger = new CustomLogger(this.constructor.name);
  }

  abstract execute(
    request?: IReq,
    session?: ClientSession,
  ): IRes | Promise<IRes>;
}
