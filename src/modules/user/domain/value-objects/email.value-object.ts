import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/core/base/domain/value-object';
import { DomainPrimitive } from 'src/core/base/types/domain-primitive.type';
import { Guard } from 'src/core/logic/guard';

export class Email extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (!Guard.isEmail(value)) {
      throw new BadRequestException('Invalid email!');
    }
  }
}
