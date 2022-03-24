import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ERRORS } from '../utils/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isAdmin = this.reflector.get<string[]>('isAdmin', context.getHandler());
    if (!isAdmin) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (user.is_admin) return true;
    else throw new ForbiddenException({ message: ERRORS.FORBIDDEN_MESSAGE });
  }
}
