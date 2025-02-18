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

  @UsePipes(new ZodValidationPipe(createHuntSchema))
  @Post()
  @ApiOperation({ summary: 'Iniciar uma nova caça por imóvel' })
  @ApiBody({
    type: Hunt,
    description: 'Dados necessários para criação da hunt',
  })
  @ApiResponse({
    type: CreateHuntSuccess,
    status: 201,
    description: 'Hunt criada com sucesso',
  })
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

  @Get('search/:userId')
  @ApiOperation({ summary: 'TODO | Busca todas as caçadas de um usuário' })
  async getAllHuntsByUser(@Param('userId') userId: string) {
    return await this.huntService.getAllHuntsByUser(userId);
  }

  @Post('new-target')
  @ApiOperation({ summary: 'TODO | Adiciona um imóvel target à uma caçada' })
  async addTargetToHunt(
    @Body(new ZodValidationPipe(addTargetToHunt))
    { huntId, targetId }: NewTarget,
  ) {
    return await this.huntService.addTargetToHunt(huntId, targetId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'TODO | Busca de caçada por id' })
  async getOneHuntById(@Param('id') id: string) {
    return await this.huntService.getOneHuntById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'TODO | Atualização de uma caçada' })
  async updateHunt(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateHuntSchema))
    updateData: UpdateHunt,
  ) {
    return await this.huntService.updateHunt(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'TODO | Deleção de uma caçada' })
  async deleteHunt(@Param('id') id: string) {
    await this.huntService.deleteHunt(id);
  }
}
