import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { CurrentUser } from '@src/modules/auth/decorators/current-user.decorator'
import { AuthenticatedUser } from '@src/modules/auth/schemas/models/auth.interface'
import { TargetPropertyService } from '@src/modules/targetProperty/services/target-property.service'
import { UserService } from '@src/modules/user/services/user.service'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor'
import { ZodValidationPipe } from '../../../shared/pipe/zod-validation.pipe'
import { CreateHuntSuccess } from '../schemas/endpoints/createHunt'
import { DeleteHuntSuccess } from '../schemas/endpoints/deleteHunt'
import {
  FindHuntByIdSuccess,
  FindHuntsByIdUserSuccess
} from '../schemas/endpoints/getHunts'
import {
  UpdateHuntBody,
  UpdateHuntSuccess
} from '../schemas/endpoints/updateHunt'
import { Hunt } from '../schemas/hunt.schema'
import {
  CreateHunt,
  createHuntSchema
} from '../schemas/zod-validation/create-hunt.zod-validation'
import {
  UpdateHunt,
  updateHuntSchema
} from '../schemas/zod-validation/update-hunt.zod-validation'
import { HuntService } from '../services/hunt-collection.service'

@ApiTags('hunt')
@UseInterceptors(LoggingInterceptor)
@Controller('hunt')
export class HuntController {
  constructor(
    private readonly huntService: HuntService,
    @Inject(forwardRef(() => TargetPropertyService))
    private readonly targetPropertyService: TargetPropertyService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  @ApiOperation({ summary: 'Cria uma caça por imóvel' })
  @ApiBody({
    type: Hunt,
    description: 'Dados necessários para criação da hunt'
  })
  @ApiResponse({
    type: CreateHuntSuccess,
    status: 201,
    description: 'Hunt criada com sucesso'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createHunt(
    @Body(new ZodValidationPipe(createHuntSchema))
    {
      title,
      livingPeople,
      livingPets,
      movingExpected,
      type,
      minBudget,
      maxBudget
    }: CreateHunt,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const currentUser = await this.userService.getById(user.id)

    return await this.huntService.createHunt({
      title,
      creatorId: user.id,
      huntUsers: [{ id: user.id, name: currentUser.name }],
      livingPeople,
      livingPets,
      movingExpected,
      minBudget,
      maxBudget,
      type,
      targets: []
    })
  }

  @ApiOperation({ summary: 'Busca de caçada por id' })
  @ApiResponse({
    type: FindHuntByIdSuccess,
    status: 200,
    description: 'Hunt encontrada com sucesso'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getOneHuntById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    if (!id) {
      throw new BadRequestException('É necessário informar a id da hunt')
    }

    const found = await this.huntService.getOneHuntById(id)

    if (!found) {
      throw new NotFoundException('Hunt não encontrada')
    }

    const validated = await this.huntService.validateUserAccess(user.id, id)

    if (!validated) {
      throw new UnauthorizedException('Usuário sem permissão nesta hunt')
    }

    return found
  }

  @ApiOperation({ summary: 'Atualização de uma caçada' })
  @ApiBody({
    type: UpdateHuntBody,
    description: 'Dados para atualização de uma caçada'
  })
  @ApiResponse({
    type: UpdateHuntSuccess,
    status: 200,
    description: 'Sucesso na atualização da Hunt'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateHunt(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateHuntSchema))
    updateData: UpdateHunt,
    @CurrentUser() user: AuthenticatedUser
  ) {
    if (!id) {
      throw new BadRequestException('É necessário informar a id da hunt')
    }

    const found = await this.huntService.getOneHuntById(id)

    if (!found) {
      throw new NotFoundException('A hunt não existe')
    }

    const validated = await this.huntService.validateUserAccess(user.id, id)

    if (!validated) {
      throw new UnauthorizedException('Usuário sem permissão nesta hunt')
    }

    return await this.huntService.updateHunt(id, {
      ...updateData,
      updatedAt: new Date().toISOString()
    })
  }

  @ApiOperation({ summary: 'Busca todas as caçadas de um usuário' })
  @ApiResponse({
    type: FindHuntsByIdUserSuccess,
    status: 200,
    description: 'Hunts do usuário encontradas com sucesso'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('search/user')
  async getAllHuntsByUser(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return await this.huntService.getAllHuntsByUser(user.id, page, limit)
  }

  @ApiOperation({ summary: 'Deleção de uma caçada' })
  @ApiResponse({
    type: DeleteHuntSuccess,
    status: 200,
    description: 'Hunt deletada com sucesso'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteHunt(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    if (!id) {
      throw new BadRequestException('É necessário informar a id da hunt')
    }

    const toDelete = await this.huntService.getOneHuntById(id)

    if (!toDelete) {
      throw new NotFoundException('Hunt não encontrada')
    }

    const validated = await this.huntService.validateUserAccess(user.id, id)

    if (!validated) {
      throw new UnauthorizedException('Usuário sem permissão nesta hunt')
    }

    const deleted = await this.huntService.deleteHunt(id)

    if (deleted) {
      toDelete.targets.forEach(async (target) => {
        await this.targetPropertyService.deleteTargetProperty(target)
      })
    }
  }
}
