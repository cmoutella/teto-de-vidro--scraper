import { forwardRef, Module } from '@nestjs/common'

import { UsersCollectionModule } from '../user/user.module'
import { AuthController } from './controllers/auth.controller'

@Module({
  imports: [forwardRef(() => UsersCollectionModule)],
  providers: [],
  controllers: [AuthController]
})
export class AuthModule {}
