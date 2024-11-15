import { Inject, Injectable } from '@nestjs/common';
import { IHelpers } from './helper.interface';
import { DateService } from './modules/date/date.service';
import { HashService } from './modules/hash/hash.service';
import { TransactionService } from './modules/transaction/transaction.service';
import { SignatureService } from './modules/signature/signature.service';
import { ConnectionName } from 'src/core/constant/database/database-name.const';
import { CacheService } from './modules/cache/cache.service';

@Injectable()
export class Helpers implements IHelpers {
  constructor(
    readonly date: DateService,
    readonly hash: HashService,
    readonly signature: SignatureService,
    readonly cache: CacheService,
    @Inject(ConnectionName.DB_PRIMARY) readonly transaction: TransactionService,
  ) {}
}
