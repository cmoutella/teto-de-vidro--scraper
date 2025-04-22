import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AddressModule } from './modules/address/address.module'
import { HuntCollectionModule } from './modules/hunt/hunt-collection.module'
import { TargetPropertyCollectionModule } from './modules/targetProperty/target-property.module'
import { UsersModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15d' }
    }),
    HuntCollectionModule,
    TargetPropertyCollectionModule,
    AddressModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
