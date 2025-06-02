import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { InvitationRepository } from './repositories/invitation.repository'
import { InvitationMongooseRepository } from './repositories/mongoose/invitation.mongoose.repository'
import { Invitation, InvitationSchema } from './schema/invitation.schema'
import { InvitationService } from './service/invitation.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema }
    ])
  ],
  providers: [
    {
      provide: InvitationRepository,
      useClass: InvitationMongooseRepository
    },
    InvitationService
  ],
  exports: [InvitationService]
})
export class InvitationModule {}
