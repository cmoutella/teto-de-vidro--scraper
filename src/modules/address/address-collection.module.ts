import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressService } from './services/address-collection.service';
import { AddressController } from './controllers/address-collection.controller';
import { LotRepository } from '../lot/repositories/lot.repository';
import { LotMongooseRepository } from '../lot/repositories/mongoose/lot.mongoose.repository';
import { PropertyRepository } from '../property/repositories/property.repository';
import { PropertyMongooseRepository } from '../property/repositories/mongoose/property.mongoose.repository';
import { Lot, LotSchema } from '../lot/schemas/lot.schema';
import { Property, PropertySchema } from '../property/schemas/property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lot.name, schema: LotSchema },
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  providers: [
    {
      provide: LotRepository,
      useClass: LotMongooseRepository,
    },
    {
      provide: PropertyRepository,
      useClass: PropertyMongooseRepository,
    },
    AddressService,
  ],
  controllers: [AddressController],
})
export class AddressModule {}
