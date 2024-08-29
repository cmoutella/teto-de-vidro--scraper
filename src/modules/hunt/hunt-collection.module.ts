import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hunt, HuntSchema } from './schemas/hunt.schema';
import { HuntRepository } from './repositories/hunt.repository';
import { HuntMongooseRepository } from './repositories/mongoose/hunt.mongoose.repository';
import { HuntService } from './services/hunt-collection.service';
import { HuntController } from './controllers/hunt-collection.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hunt.name, schema: HuntSchema }]),
  ],
  providers: [
    {
      provide: HuntRepository,
      useClass: HuntMongooseRepository,
    },
    HuntService,
  ],
  controllers: [HuntController],
})
export class HuntCollectionModule {}
