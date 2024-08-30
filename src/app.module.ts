import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LotCollectionModule } from './modules/lot/lot-collection.module';
import { UsersModule } from './modules/user/user.module';
import { PropertyCollectionModule } from './modules/property/property-collection.module';
import { AddressModule } from './modules/address/address-collection.module';
import { HuntCollectionModule } from './modules/hunt/hunt-collection.module';
import { TargetPropertyCollectionModule } from './modules/targetProperty/target-property.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    HuntCollectionModule,
    LotCollectionModule,
    PropertyCollectionModule,
    TargetPropertyCollectionModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
