import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    return next.handle().pipe(
      tap(() => {
        const user = request.user as { role: string; appName: string }

        if (user) {
          response.setHeader('x-user-role', user.role)
          response.setHeader('x-user-client', user.appName)
        }
      })
    )
  }
}
