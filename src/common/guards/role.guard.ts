import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isAdmin = this.reflector.get<string[]>('isAdmin', context.getHandler());
    // console.log(context.switchToHttp().getRequest());
    if (!isAdmin) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    console.log('User is', user);
    if (user.is_admin) return true;
    else throw new ForbiddenException({ message: 'You are not allowed to perform this action' });
  }
}
