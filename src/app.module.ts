import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from './helper/helper.module';
import { databaseProviders } from './infra/database/database.provider';
import { ResourceModule } from './modules/resource.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...databaseProviders,
    HelperModule,
    ResourceModule,
  ],
})
export class AppModule {}
