import { Catch, HttpStatus, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Request } from 'express';
import { IResponse } from '../interfaces/index';
import * as crypto from 'crypto';
@Catch(PrismaClientKnownRequestError)
export class QueryExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const name = exception.name;
    let message = exception.message;
    const errorCode = exception.code;
    // This can be used as trace_id for our logger, where we can dump the error stack (not implemented)
    const meta = exception.meta;
    // const meta = crypto.randomBytes(12).toString('hex');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    switch (errorCode) {
      case 'P2002':
        message = 'Unique Constraint Error: User already exists';
        break;

      default:
        message = Object.values(meta)[0];
    }

    const data: IResponse = {
      status: 'fail',
      message: message,
      error: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        errorCode,
        meta,
        name,
        // Unique ID for error logging
        trace_id: crypto.randomBytes(12).toString('hex'),
      },
    };

    return response.status(HttpStatus.BAD_REQUEST).json(data);
  }
}
