import { Global, Module } from '@nestjs/common';
import { InitModule } from './modules/init.module';
import { EnvModule } from 'src/infra/config/env.module';
import { Helpers } from './helper.service';

@Global()
@Module({
  imports: [InitModule, EnvModule],
  providers: [Helpers],
  exports: [Helpers],
})
export class HelperModule {}
