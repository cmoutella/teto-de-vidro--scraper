import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AccessLevelPoliciessController } from './controllers/access-level-policies.controller'
import { AccessLevelPoliciesRepository } from './repositories/access-level-policies.repository'
import { AccessLevelPoliciesMongooseRepository } from './repositories/mongoose/access-level-policies.mongoose.repository'
import {
  AccessLevelPolicies,
  AccessLevelPoliciesSchema
} from './schema/accessLevelPolicies.schema'
import { AccessLevelPoliciesService } from './services/access-level-policies.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccessLevelPolicies.name, schema: AccessLevelPoliciesSchema }
    ])
  ],
  providers: [
    {
      provide: AccessLevelPoliciesRepository,
      useClass: AccessLevelPoliciesMongooseRepository
    },
    AccessLevelPoliciesService
  ],
  controllers: [AccessLevelPoliciessController],
  exports: [AccessLevelPoliciesService]
})
export class AccessLevelPoliciesModule {}
