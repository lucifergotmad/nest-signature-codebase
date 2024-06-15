import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { ITransactionService } from './transaction.interface';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async startTransaction(): Promise<ClientSession> {
    const session: ClientSession = await this.connection.startSession();
    return session;
  }

  async commitTransaction(session: ClientSession): Promise<void> {
    await session.commitTransaction();
    session.endSession();
  }

  async rollbackTransaction(session: ClientSession): Promise<void> {
    await session.abortTransaction();
    session.endSession();
  }
}
