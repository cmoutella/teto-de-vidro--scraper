import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/user/user.module';
import { AddressModule } from './modules/address/address.module';
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
    TargetPropertyCollectionModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
