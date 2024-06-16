import { IDateService } from './modules/date/date.interface';
import { IHashService } from './modules/hash/hash.interface';
import { ISignatureService } from './modules/signature/signature.interface';
import { ITransactionService } from './modules/transaction/transaction.interface';

export interface IHelpers {
  date: IDateService;
  hash: IHashService;
  signature: ISignatureService;
  transaction: ITransactionService;
}
