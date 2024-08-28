import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schemas/property.schema';
import { PropertyRepository } from './repositories/property.repository';
import { PropertyMongooseRepository } from './repositories/mongoose/property.mongoose.repository';
import { PropertyService } from './services/property-collection.service';
import { PropertyController } from './controllers/property-collection.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  providers: [
    {
      provide: PropertyRepository,
      useClass: PropertyMongooseRepository,
    },
    PropertyService,
  ],
  controllers: [PropertyController],
})
export class PropertyCollectionModule {}
