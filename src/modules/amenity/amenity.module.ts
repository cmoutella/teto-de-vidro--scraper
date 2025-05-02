import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AmenitiesController } from './controllers/amenity.controller'
import { AmenityRepository } from './repositories/amenity.repository'
import { AmenityMongooseRepository } from './repositories/mongoose/amenity.mongoose.repository'
import { Amenity, AmenitySchema } from './schemas/amenity.schema'
import { AmenityService } from './services/amenity.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Amenity.name, schema: AmenitySchema }])
  ],
  providers: [
    {
      provide: AmenityRepository,
      useClass: AmenityMongooseRepository
    },
    AmenityService
  ],
  controllers: [AmenitiesController],
  exports: [AmenityService]
})
export class AmenitiesCollectionModule {}
