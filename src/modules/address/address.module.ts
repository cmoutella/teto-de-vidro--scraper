import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AddressController } from './controllers/address.controller'
import { LotRepository } from './repositories/lot.repository'
import { LotMongooseRepository } from './repositories/mongoose/lot.mongoose.repository'
import { PropertyMongooseRepository } from './repositories/mongoose/property.mongoose.repository'
import { PropertyRepository } from './repositories/property.repository'
import { Lot, LotSchema } from './schemas/lot.schema'
import { Property, PropertySchema } from './schemas/property.schema'
import { AddressService } from './services/address.service'
import { LotService } from './services/lot-collection.service'
import { PropertyService } from './services/property-collection.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lot.name, schema: LotSchema },
      { name: Property.name, schema: PropertySchema }
    ])
  ],
  providers: [
    {
      provide: LotRepository,
      useClass: LotMongooseRepository
    },
    {
      provide: PropertyRepository,
      useClass: PropertyMongooseRepository
    },
    LotService,
    PropertyService,
    AddressService
  ],
  controllers: [AddressController],
  exports: [AddressService, LotService, PropertyService]
})
export class AddressModule {}
