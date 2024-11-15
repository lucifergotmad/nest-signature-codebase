import { Module } from '@nestjs/common';
import { EnvModule } from 'src/infra/config/env.module';
import { DateService } from './date/date.service';
import { HashService } from './hash/hash.service';
import { SignatureService } from './signature/signature.service';
import { CacheService } from './cache/cache.service';
import { transactionProvider } from './transaction/transaction.provider';

@Module({
  imports: [EnvModule],
  providers: [
    DateService,
    HashService,
    SignatureService,
    CacheService,
    ...transactionProvider,
  ],
  exports: [
    DateService,
    HashService,
    SignatureService,
    CacheService,
    ...transactionProvider,
  ],
})
export class InitModule {}
