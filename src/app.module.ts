import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from './helper/helper.module';
import { DatabaseProviders } from './infra/database/database.provider';
import { ResourceModule } from './modules/resource.module';
import { ThrottleProvider } from './infra/throttle/throttle.provider';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, store: 'memory', ttl: 6000 }),
    ConfigModule.forRoot({ isGlobal: true }),
    ...ThrottleProvider,
    ...DatabaseProviders,
    HelperModule,
    ResourceModule,
  ],
})
export class AppModule {}
