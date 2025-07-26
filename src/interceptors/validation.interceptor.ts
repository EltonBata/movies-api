import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((httpError: any) => {
        if (
          Array.isArray(httpError.response?.message) &&
          httpError.status === 400
        ) {
          const errorMessagesByField = httpError.response.message.reduce(
            (
              accumulatedErrors: Record<string, string[]>,
              errorMessage: string,
            ) => {
              const [fieldName] = errorMessage.split(' ');

              if (!accumulatedErrors[fieldName]) {
                accumulatedErrors[fieldName] = [];
              }

              accumulatedErrors[fieldName].push(errorMessage);

              return accumulatedErrors;
            },
            {} as Record<string, string[]>,
          );

          throw new BadRequestException({
            errors: errorMessagesByField,
            error: 'Bad Request',
            statusCode: 400,
          });
        }
        throw httpError;
      }),
    );
  }
}
