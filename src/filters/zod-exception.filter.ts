import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { formatZodErrors } from 'src/utils/zodErrorFormatter';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = 400;
    const formattedErrors = formatZodErrors(exception);

    response.status(code).json({
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
}
