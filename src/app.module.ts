import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LotCollectionModule } from './modules/lot/lot-collection.module';
import { UsersModule } from './modules/user/user.module';
import { PropertyCollectionModule } from './modules/property/property-collection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    LotCollectionModule,
    PropertyCollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
