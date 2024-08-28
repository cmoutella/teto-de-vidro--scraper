import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor';
import { InterfaceUser } from '../schemas/models/user.interface';
import { UserService } from '../services/user.service';

import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';

const GENDERS = ['male', 'female', 'neutral'] as const;

const createUserSchema = z.object({
  nickName: z.string(),
  name: z.string(),
  password: z.string(),
  profession: z.string().optional(),
  gender: z.enum(GENDERS).optional(),
  birthDate: z.date(),
  email: z.string(),
});

type CreateUser = z.infer<typeof createUserSchema>;

@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ZodValidationPipe(createUserSchema))
  @Post()
  async createUser(
    @Body()
    {
      email,
      nickName,
      name,
      password,
      profession,
      gender,
      birthDate,
    }: CreateUser,
  ) {
    return await this.userService.createUser({
      email,
      nickName,
      name,
      password,
      profession,
      gender,
      birthDate,
    });
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...data } = await this.userService.getById(id);

    const user: Omit<InterfaceUser, 'password'> = {
      ...data,
    };
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
