import { Body, Controller, Param, Query } from '@nestjs/common';
import { GetPaginationDTO } from 'src/core/base/http/get-pagination.dto.base';
import { JwtDecoded } from 'src/core/base/module/use-case.base';
import { AuthUser } from 'src/core/decorator/auth-user.decorator';
import { SecureDelete } from 'src/core/decorator/secure-delete.decorator';
import { SecureGet } from 'src/core/decorator/secure-get.decorator';
import { SecurePost } from 'src/core/decorator/secure-post.decorator';
import { SecurePut } from 'src/core/decorator/secure-put.decorator';

import { CreateUser } from '../use-cases/create-user.use-case';
import { DeleteUser } from '../use-cases/delete-user.use-case';
import { GetUser } from '../use-cases/get-user.use-case';
import { UpdateUser } from '../use-cases/update-user.use-case';

import { CreateUserRequestDTO } from './dtos/create-user.request.dto';
import { UpdateUserRequestDTO } from './dtos/update-user.request.dto';

@Controller('v1/users')
export class UsersController {
  constructor(
    private readonly deleteUser: DeleteUser,
    private readonly updateUser: UpdateUser,
    private readonly getUser: GetUser,
    private readonly createUser: CreateUser,
  ) {}

  @SecurePost()
  async createUserHandler(
    @Body() body: CreateUserRequestDTO,
    @AuthUser() user: JwtDecoded,
  ) {
    return await this.createUser.execute({ data: body, user });
  }

  @SecureGet()
  async getUserHandler(@Query() query: GetPaginationDTO) {
    return this.getUser.execute({ data: query });
  }

  @SecureDelete(':_id')
  async deleteUserHandler(@Param('_id') _id: string) {
    return this.deleteUser.execute({ _id });
  }

  @SecurePut(':_id')
  update(@Param('_id') _id: string, @Body() body: UpdateUserRequestDTO) {
    return this.updateUser.execute({ _id, data: body });
  }
}
