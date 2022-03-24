import { Catch, ArgumentsHost, HttpException, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { IResponse } from '../interfaces';
import * as crypto from 'crypto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorCode = exception.getStatus?.() || HttpStatus.BAD_REQUEST;
    // This can be used as trace_id for our logger, where we can dump the error stack (not implemented)
    const meta = null;
    const request: Request = ctx.getRequest();

    const data: IResponse = {
      status: 'fail',
      message: exception.message,
      error: {
        name: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        errorCode,
        meta,
        trace_id: crypto.randomBytes(12).toString('hex'),
      },
    };

    return response.status(errorCode).json(data);
  }
}
