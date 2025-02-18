import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor';
import { ZodValidationPipe } from '../../../shared/pipe/zod-validation.pipe';
import { HuntService } from '../services/hunt-collection.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Hunt } from '../schemas/hunt.schema';
import { CreateHuntSuccess } from '../schemas/endpoints/createHunt';
import {
  FindHuntByIdSuccess,
  FindHuntsByIdUserSuccess,
} from '../schemas/endpoints/getHunts';
import { DeleteHuntSuccess } from '../schemas/endpoints/deleteHunt';
import {
  UpdateHuntBody,
  UpdateHuntSuccess,
} from '../schemas/endpoints/updateHunt';

const CONTRACT_TYPE = ['buy', 'rent', 'either'] as const;

const createHuntSchema = z.object({
  creatorId: z.string(),
  invitedUsers: z.array(z.string()).optional(),
  title: z.string().optional(),
  movingExpected: z.string().optional(),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  livingPeople: z.number().optional(),
  livingPets: z.number().optional(),
  type: z.enum(CONTRACT_TYPE).optional(),
});

type CreateHunt = z.infer<typeof createHuntSchema>;

const updateHuntSchema = z.object({
  invitedUsers: z.array(z.string()).optional(),
  title: z.string().optional(),
  movingExpected: z.string().optional(),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  livingPeople: z.number().optional(),
  livingPets: z.number().optional(),
  type: z.enum(CONTRACT_TYPE).optional(),
});

type UpdateHunt = z.infer<typeof updateHuntSchema>;

const addTargetToHunt = z.object({
  targetId: z.string(),
  huntId: z.string(),
});

type NewTarget = z.infer<typeof addTargetToHunt>;

@ApiTags('hunt')
@UseInterceptors(LoggingInterceptor)
@Controller('hunt')
export class HuntController {
  constructor(private readonly huntService: HuntService) {}

  @ApiOperation({ summary: 'Cria uma caça por imóvel' })
  @ApiBody({
    type: Hunt,
    description: 'Dados necessários para criação da hunt',
  })
  @ApiResponse({
    type: CreateHuntSuccess,
    status: 201,
    description: 'Hunt criada com sucesso',
  })
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
      maxBudget,
    }: CreateHunt,
  ) {
    return await this.huntService.createHunt({
      title,
      creatorId,
      invitedUsers,
      livingPeople,
      livingPets,
      movingExpected,
      minBudget,
      maxBudget,
      type,
      targets: [],
    });
  }

  @ApiOperation({ summary: 'Busca de caçada por id' })
  @ApiResponse({
    type: FindHuntByIdSuccess,
    status: 200,
    description: 'Hunt encontrada com sucesso',
  })
  @Get(':id')
  async getOneHuntById(@Param('id') id: string) {
    return await this.huntService.getOneHuntById(id);
  }

  @ApiOperation({ summary: 'Atualização de uma caçada' })
  @ApiBody({
    type: UpdateHuntBody,
    description: 'Dados para atualização de uma caçada',
  })
  @ApiResponse({
    type: UpdateHuntSuccess,
    status: 200,
    description: 'Sucesso na atualização da Hunt',
  })
  @Put(':id')
  async updateHunt(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateHuntSchema))
    updateData: UpdateHunt,
  ) {
    return await this.huntService.updateHunt(id, updateData);
  }

  @ApiOperation({ summary: 'Busca todas as caçadas de um usuário' })
  @ApiResponse({
    type: FindHuntsByIdUserSuccess,
    status: 200,
    description: 'Hunts do usuário encontradas com sucesso',
  })
  @Get('search/:userId')
  async getAllHuntsByUser(@Param('userId') userId: string) {
    return await this.huntService.getAllHuntsByUser(userId);
  }

  @Post('new-target')
  @ApiOperation({ summary: 'TODO | Adiciona um imóvel target à uma caçada' })
  async addTargetToHunt(
    @Body(new ZodValidationPipe(addTargetToHunt))
    { huntId, targetId }: NewTarget,
  ) {
    // deveria verificar se existe uma hunt com essa id
    // isso talvez devesse acontecer na controller do targetProperty
    return await this.huntService.addTargetToHunt(huntId, targetId);
  }

  @ApiOperation({ summary: 'Deleção de uma caçada' })
  @ApiResponse({
    type: DeleteHuntSuccess,
    status: 200,
    description: 'Hunt deletada com sucesso',
  })
  @Delete(':id')
  async deleteHunt(@Param('id') id: string) {
    await this.huntService.deleteHunt(id);
  }
}
