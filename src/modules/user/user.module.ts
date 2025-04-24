import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersController } from './controllers/users.controller'
import { UserMongooseRepository } from './repositories/mongoose/user.mongoose.repository'
import { UserRepository } from './repositories/user.repository'
import { User, UserSchema } from './schemas/user.schema'
import { UserService } from './services/user.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserMongooseRepository
    },
    UserService
  ],
  controllers: [UsersController],
  exports: [UserService, UserRepository]
})
export class UsersCollectionModule {}
