import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Helpers } from 'src/helper/helper.service';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(
    private readonly helpers: Helpers,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const signature =
      (req.headers.signature as string) || (req.query['signature'] as string);
    const timestamp =
      (req.headers.timestamp as string) || (req.query['timestamp'] as string);
    const accessToken =
      (req.headers.authorization as string) ||
      (req.query['authorization'] as string) ||
      '';

    console.log(signature);
    console.log(timestamp);

    const isValidSignature = this.helpers.signature.validateSignature(
      signature,
      timestamp,
      accessToken.slice('bearer '.length),
      60,
    );

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid Signature.');
    }

    return true;
  }
}
