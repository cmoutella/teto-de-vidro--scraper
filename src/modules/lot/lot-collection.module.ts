import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from './schemas/lot.schema';
import { LotRepository } from './repositories/lot.repository';
import { LotMongooseRepository } from './repositories/mongoose/lot.mongoose.repository';
import { LotService } from './services/lot-collection.service';
import { LotController } from './controllers/lot-collection.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lot.name, schema: LotSchema }])],
  providers: [
    {
      provide: LotRepository,
      useClass: LotMongooseRepository,
    },
    LotService,
  ],
  controllers: [LotController],
})
export class LotCollectionModule {}
