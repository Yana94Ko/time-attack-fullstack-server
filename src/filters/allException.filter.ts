import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Response } from 'express';
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      exception instanceof PrismaClientInitializationError ||
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientRustPanicError ||
      exception instanceof PrismaClientUnknownRequestError ||
      exception instanceof PrismaClientValidationError
    ) {
      const status = 400;
      const message = exception.message.replace(
        /\/\w+|\n|\{\W+|\(.*?\)|\{.*?\}|\<.*?\>|\d+\s+/gi,
        '',
      );
      response.status(status).json({
        success: false,
        result: null,
        message: message,
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;

      response.status(status).json({
        success: false,
        result: null,
        message: message,
      });
    } else {
      response.status(500).json({
        success: false,
        result: null,
        message: 'Internal server error - check server',
      });
    }
  }
}
