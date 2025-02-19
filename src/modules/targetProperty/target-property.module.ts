import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TargetProperty,
  TargetPropertySchema,
} from './schemas/target-property.schema';
import { TargetPropertyRepository } from './repositories/target-property.repository';
import { TargetPropertyMongooseRepository } from './repositories/mongoose/target-property.mongoose.repository';
import { TargetPropertyService } from './services/target-property.service';
import { TargetPropertyController } from './controllers/target-property.controller';
import { HuntService } from '../hunt/services/hunt-collection.service';
import { HuntRepository } from '../hunt/repositories/hunt.repository';
import { HuntMongooseRepository } from '../hunt/repositories/mongoose/hunt.mongoose.repository';
import { Hunt, HuntSchema } from '../hunt/schemas/hunt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TargetProperty.name, schema: TargetPropertySchema },
    ]),
    MongooseModule.forFeature([{ name: Hunt.name, schema: HuntSchema }]),
  ],
  providers: [
    {
      provide: TargetPropertyRepository,
      useClass: TargetPropertyMongooseRepository,
    },
    {
      provide: HuntRepository,
      useClass: HuntMongooseRepository,
    },
    TargetPropertyService,
    HuntService,
  ],
  controllers: [TargetPropertyController],
})
export class TargetPropertyCollectionModule {}
