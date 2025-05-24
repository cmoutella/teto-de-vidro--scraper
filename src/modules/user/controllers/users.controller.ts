import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor'
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe'
import { z } from 'zod'

import { EncryptPasswordPipe } from '../pipe/password.pipe'
import {
  CreateUserFailureException,
  CreateUserSuccess
} from '../schemas/endpoints/createUser'
import { DeleteUserSuccess } from '../schemas/endpoints/deleteUser'
import {
  GetAllUsersSuccess,
  GetOneUserSuccess
} from '../schemas/endpoints/getUsers'
import { InterfaceUser } from '../schemas/models/user.interface'
import { User } from '../schemas/user.schema'
import { UserService } from '../services/user.service'

const GENDERS = ['male', 'female', 'neutral'] as const

const createUserSchema = z.object({
  nickName: z.string(),
  name: z.string(),
  password: z.string(),
  profession: z.string().optional(),
  gender: z.enum(GENDERS).optional(),
  birthDate: z.string(),
  email: z.string()
})

type CreateUser = z.infer<typeof createUserSchema>

@ApiTags('user')
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new EncryptPasswordPipe())
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({
    type: User,
    description: 'Data needed to create new user'
  })
  @ApiResponse({
    type: CreateUserSuccess,
    status: 201,
    description: 'Usuário criado com sucesso'
  })
  @ApiResponse({
    type: CreateUserFailureException,
    status: 409,
    description: 'Nome de usuário já existe'
  })
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
      birthDate
    }: CreateUser
  ) {
    return await this.userService.createUser({
      email,
      nickName,
      name,
      password,
      profession,
      gender,
      birthDate
    })
  }

  @ApiOperation({ summary: 'Busca por todos os usuários' })
  @ApiResponse({
    type: GetAllUsersSuccess,
    status: 200,
    description: 'Usuários encontrados com sucesso'
  })
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers()
  }

  @ApiOperation({ summary: 'Busca usuários por id' })
  @ApiResponse({
    type: GetOneUserSuccess,
    status: 200,
    description: 'Usuário encontrado com sucesso'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    const { password, ...data } = await this.userService.getById(id)

    const user: Omit<InterfaceUser, 'password'> = {
      ...data
    }
    return user
  }

  @ApiOperation({ summary: 'Deleta um usuário por id' })
  @ApiResponse({
    type: DeleteUserSuccess,
    status: 200,
    description: 'Usuário deletado com sucesso'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id)
  }
}
