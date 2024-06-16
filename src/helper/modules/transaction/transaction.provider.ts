import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TransactionService } from './transaction.service';
import { ConnectionName } from 'src/core/constant/database/database-name.const';

export const transactionProvider = [
  {
    provide: ConnectionName.DB_PRIMARY,
    useFactory: (primaryConnection: Connection) =>
      new TransactionService(primaryConnection),
    inject: [getConnectionToken()],
  },
];
