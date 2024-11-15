import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/core/base/domain/value-object';
import { DomainPrimitive } from 'src/core/base/types/domain-primitive.type';
import { Role } from 'src/core/constant/app';

export class UserRole extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  protected validate({ value }: DomainPrimitive<string>) {
    const isRoleValid = this._getValidRole().find(
      (role: string) => role === value,
    );
    if (!isRoleValid)
      throw new BadRequestException('The User Role is not valid');
  }

  private _getValidRole() {
    return Object.values(Role);
  }
}
