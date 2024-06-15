import { Global, Module } from '@nestjs/common';
import { EnvModule } from 'src/infra/config/env.module';
import { HashService } from './modules/hash/hash.service';
import { SignatureService } from './modules/signature/signature.service';
import { transactionProvider } from './modules/transaction/transaction.provider';
import { DateService } from './modules/date/date.service';

@Global()
@Module({
  imports: [EnvModule],
  providers: [
    SignatureService,
    HashService,
    DateService,
    ...transactionProvider,
  ],
  exports: [SignatureService, HashService, DateService, ...transactionProvider],
})
export class HelperModule {}
