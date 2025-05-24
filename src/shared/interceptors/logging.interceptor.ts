import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()

    console.log('#####################')
    console.log('Request received:', request.method)
    console.log('route', request.route.path)
    console.log('authorization_sent', !!request.headers.authorization)

    const now = Date.now()

    return next
      .handle()
      .pipe(tap(() => console.log(`___After... ${Date.now() - now}ms`)))
  }
}
