import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AuthenticatedUser } from '../types/auth.interface'

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    return next.handle().pipe(
      tap(() => {
        const user = request.user as AuthenticatedUser

        if (user) {
          response.setHeader('x-user-id', user.id)
          response.setHeader('x-user-role', user.role)
          response.setHeader('x-user-level', user.accessLevel)
        }
      })
    )
  }
}
