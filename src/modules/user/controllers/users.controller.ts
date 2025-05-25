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
import {
  CreateUser,
  createUserSchema
} from '../schemas/zod-validation/create-user.zod-validation'
import {
  InviteUser,
  inviteUserSchema
} from '../schemas/zod-validation/invite-user.zod-validation'
import { UserService } from '../services/user.service'

@ApiTags('user')
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

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
    description: 'Email ou CPF já cadastrado'
  })
  @Post()
  async createUser(
    @Body()
    {
      email,
      name,
      familyName,
      cpf,
      accessLevel,
      status,
      password,
      profession,
      gender,
      birthDate
    }: CreateUser
  ) {
    return await this.userService.createUser({
      email,
      name,
      familyName,
      cpf,
      accessLevel,
      status,
      password,
      profession,
      gender,
      birthDate
    })
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(inviteUserSchema))
  @ApiOperation({ summary: 'Convida um novo usuário' })
  @Post('invite')
  async inviteUser(
    @Body()
    user: InviteUser
  ) {
    return await this.userService.inviteUser(user)
  }

  // TODO: update user

  // TODO: update email

  // TODO: update password

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
