import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { InterfaceResponse } from '../types/response';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, InterfaceResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<InterfaceResponse<T>> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        status: res.statusCode as number,
        message: res.message as string,
        data: data as T,
        // meta: {}, to return pagination info
      })),
    );
  }
}
