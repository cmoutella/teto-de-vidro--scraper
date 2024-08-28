import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { UserMongooseRepository } from './repositories/mongoose/user.mongoose.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserMongooseRepository,
    },
    UserService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
