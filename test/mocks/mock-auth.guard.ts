import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@src/shared/guards/auth.guard'

@Injectable()
export class MockAuthGuard implements CanActivate {
  static allow = true

  canActivate(_context: ExecutionContext): boolean {
    return MockAuthGuard.allow
  }
}

export function getAuthGuardToken() {
  const guard = AuthGuard
  return guard
}
