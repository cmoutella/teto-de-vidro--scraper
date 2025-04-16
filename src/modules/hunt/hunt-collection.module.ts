import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hunt, HuntSchema } from './schemas/hunt.schema';
import { HuntRepository } from './repositories/hunt.repository';
import { HuntMongooseRepository } from './repositories/mongoose/hunt.mongoose.repository';
import { HuntService } from './services/hunt-collection.service';
import { HuntController } from './controllers/hunt-collection.controller';
import { TargetPropertyCollectionModule } from '../targetProperty/target-property.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hunt.name, schema: HuntSchema }]),
    forwardRef(() => TargetPropertyCollectionModule),
  ],
  providers: [
    {
      provide: HuntRepository,
      useClass: HuntMongooseRepository,
    },
    HuntService,
  ],
  controllers: [HuntController],
  exports: [HuntService, HuntRepository],
})
export class HuntCollectionModule {}
