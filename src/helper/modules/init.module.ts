import { Module } from '@nestjs/common';
import { EnvModule } from 'src/infra/config/env.module';
import { DateService } from './date/date.service';
import { HashService } from './hash/hash.service';
import { SignatureService } from './signature/signature.service';
import { transactionProvider } from './transaction/transaction.provider';

@Module({
  imports: [EnvModule],
  providers: [
    DateService,
    HashService,
    SignatureService,
    ...transactionProvider,
  ],
  exports: [DateService, HashService, SignatureService, ...transactionProvider],
})
export class InitModule {}
