import { Module } from '@nestjs/common';
import { UserUseCaseModule } from '../user/use-cases/user.use-case.module';
import { AuthController } from './controller/auth.controller';
import { AuthUseCaseModule } from './use-cases/auth.use-case.module';

@Module({
  imports: [AuthUseCaseModule, UserUseCaseModule],
  controllers: [AuthController],
})
export class AuthModule {}
