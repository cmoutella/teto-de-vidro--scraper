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
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { z } from 'zod';

import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { EncryptPasswordPipe } from '../pipe/password.pipe';

import {
  InterfaceUser,
  UserCredentials,
} from '../schemas/models/user.interface';
import { UserService } from '../services/user.service';
import { addDays } from 'date-fns';
import { ApiTags } from '@nestjs/swagger';

const GENDERS = ['male', 'female', 'neutral'] as const;

const createUserSchema = z.object({
  nickName: z.string(),
  name: z.string(),
  password: z.string(),
  profession: z.string().optional(),
  gender: z.enum(GENDERS).optional(),
  birthDate: z.string(),
  email: z.string(),
});

type CreateUser = z.infer<typeof createUserSchema>;

@ApiTags('user')
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  // @ApiBearerAuth()
  @UsePipes(new EncryptPasswordPipe())
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

  @Post('/login')
  async authUser(@Body() credentials: UserCredentials) {
    const { email, password } = credentials;

    const foundUser = await this.userService.getByEmail(email);
    const passwordMatch = await compare(password, foundUser.password);

    if (!passwordMatch) throw new Error('Username or password is wrong');

    const authDate = new Date();
    const token = await this.jwtService.sign({ email: email });
    const tokenExpiration = addDays(authDate, 15);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...otherData } = foundUser;

    return {
      token: token,
      user: otherData,
      expireAt: tokenExpiration.toISOString(),
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
