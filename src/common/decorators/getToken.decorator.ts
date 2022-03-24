import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
});
