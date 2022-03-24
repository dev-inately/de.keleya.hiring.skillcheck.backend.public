import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ERRORS } from '../utils/constants';

@Injectable()
export class CurrentUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const thisUser = this.reflector.get<string[]>('currentUser', context.getHandler());
    if (!thisUser) return true;
    const req = context.switchToHttp().getRequest();
    const { user, body, query, params } = req;
    if (user.is_admin) return true;
    console.log('User is', user);
    const idField = body.id || query.id || params.id;

    if (String(user?.id) === String(idField)) return true;

    throw new ForbiddenException({ message: ERRORS.FORBIDDEN_MESSAGE });
  }
}
