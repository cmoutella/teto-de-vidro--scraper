import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthenticatedUser } from '@src/modules/auth/schemas/models/auth.interface'
import { Request } from 'express'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []

    return type === 'Bearer' ? token : null
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload: AuthenticatedUser | null =
        await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET
        })

      if (payload && payload.role !== 'admin' && payload.role !== 'master') {
        throw new UnauthorizedException('Apenas pessoas autorizadas')
      }

      if (payload) request['user'] = payload
    } catch (_err) {
      throw new UnauthorizedException()
    }

    return true
  }
}
