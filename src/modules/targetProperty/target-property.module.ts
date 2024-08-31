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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TargetProperty.name, schema: TargetPropertySchema },
    ]),
  ],
  providers: [
    {
      provide: TargetPropertyRepository,
      useClass: TargetPropertyMongooseRepository,
    },
    TargetPropertyService,
  ],
  controllers: [TargetPropertyController],
})
export class TargetPropertyCollectionModule {}
