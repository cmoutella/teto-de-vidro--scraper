import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hunt, HuntSchema } from './schemas/hunt.schema';
import { HuntRepository } from './repositories/hunt.repository';
import { HuntMongooseRepository } from './repositories/mongoose/hunt.mongoose.repository';
import { HuntService } from './services/hunt-collection.service';
import { HuntController } from './controllers/hunt-collection.controller';
import {
  TargetProperty,
  TargetPropertySchema,
} from '../targetProperty/schemas/target-property.schema';
import { TargetPropertyRepository } from '../targetProperty/repositories/target-property.repository';
import { TargetPropertyMongooseRepository } from '../targetProperty/repositories/mongoose/target-property.mongoose.repository';
import { TargetPropertyService } from '../targetProperty/services/target-property.service';

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
  controllers: [HuntController],
})
export class HuntCollectionModule {}
