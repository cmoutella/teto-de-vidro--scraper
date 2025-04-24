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
import { TargetPropertyService } from '@src/modules/targetProperty/services/target-property.service'
import { UserService } from '@src/modules/user/services/user.service'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { z } from 'zod'

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
import { HuntService } from '../services/hunt-collection.service'

const CONTRACT_TYPE = ['buy', 'rent', 'either'] as const

const createHuntSchema = z.object({
  creatorId: z.string(),
  invitedUsers: z.array(z.string()).optional(),
  title: z.string().optional(),
  movingExpected: z.string().optional(),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  livingPeople: z.number().optional(),
  livingPets: z.number().optional(),
  type: z.enum(CONTRACT_TYPE).optional()
})

type CreateHunt = z.infer<typeof createHuntSchema>

const updateHuntSchema = z.object({
  invitedUsers: z.array(z.string()).optional(),
  title: z.string().optional(),
  movingExpected: z.string().optional(),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  livingPeople: z.number().optional(),
  livingPets: z.number().optional(),
  type: z.enum(CONTRACT_TYPE).optional()
})

type UpdateHunt = z.infer<typeof updateHuntSchema>

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
  @UsePipes(new ZodValidationPipe(createHuntSchema))
  @Post()
  async createHunt(
    @Body()
    {
      title,
      creatorId,
      invitedUsers,
      livingPeople,
      livingPets,
      movingExpected,
      type,
      minBudget,
      maxBudget
    }: CreateHunt
  ) {
    if (!creatorId) {
      throw new BadRequestException(
        'É necessário um usuário para criar uma hunt'
      )
    }

    const user = await this.userService.getById(creatorId)
    if (!user) {
      throw new NotFoundException('Usuário não existe')
    }

    return await this.huntService.createHunt({
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title,
      creatorId,
      invitedUsers,
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
  async getOneHuntById(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('É necessário informar a id da hunt')
    }

    const found = await this.huntService.getOneHuntById(id)

    if (!found) {
      throw new NotFoundException('Hunt não encontrada')
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
    updateData: UpdateHunt
  ) {
    if (!id) {
      throw new BadRequestException('É necessário informar a id da hunt')
    }

    const found = await this.huntService.getOneHuntById(id)

    if (!found) {
      throw new NotFoundException('A hunt não existe')
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
  @Get('search/:userId')
  async getAllHuntsByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    if (!userId) {
      throw new BadRequestException('É necessário informar a id do usuário')
    }

    return await this.huntService.getAllHuntsByUser(userId, page, limit)
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
  async deleteHunt(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('É necessário informar a id da hunt')
    }

    const toDelete = await this.huntService.getOneHuntById(id)

    if (!toDelete) {
      throw new NotFoundException('Hunt não encontrada')
    }

    const deleted = await this.huntService.deleteHunt(id)

    if (deleted) {
      toDelete.targets.forEach(async (target) => {
        await this.targetPropertyService.deleteTargetProperty(target)
      })
    }
  }
}
