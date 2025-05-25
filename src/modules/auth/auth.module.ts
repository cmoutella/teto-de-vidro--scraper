import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UsersCollectionModule } from '../user/user.module'
import { AuthController } from './controllers/auth.controller'
import { JwtStrategy } from './strategy/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15d' }
    }),
    forwardRef(() => UsersCollectionModule)
  ],
  providers: [JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
