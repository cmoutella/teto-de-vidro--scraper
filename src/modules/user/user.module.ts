import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AccessLevelPoliciesModule } from '../accessLevelPolicies/access-level-policies.module'
import { HuntCollectionModule } from '../hunt/hunt-collection.module'
import { InvitationModule } from '../invitation/invitation.module'
import { UsersController } from './controllers/users.controller'
import { UserMongooseRepository } from './repositories/mongoose/user.mongoose.repository'
import { UserRepository } from './repositories/user.repository'
import { User, UserSchema } from './schemas/user.schema'
import { UserService } from './services/user.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => InvitationModule),
    forwardRef(() => AccessLevelPoliciesModule),
    forwardRef(() => HuntCollectionModule)
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
