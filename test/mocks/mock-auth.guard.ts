import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@src/shared/guards/auth.guard'

@Injectable()
export class MockAuthGuard implements CanActivate {
  static allow = true
  static mockUser = {
    id: 'user-123',
    email: 'user@tests.mock',
    accessLevel: 0,
    status: 'regular'
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    request.user = MockAuthGuard.allow ? MockAuthGuard.mockUser : {}

    return MockAuthGuard.allow
  }
}

export function getAuthGuardToken() {
  const guard = AuthGuard
  return guard
}
