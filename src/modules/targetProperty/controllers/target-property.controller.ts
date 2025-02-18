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
import { TargetPropertyService } from '../services/target-property.service';
import { PROPERTY_SUN_LIGHT } from 'src/shared/const';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

const HUNTING_STAGE = [
  'new',
  'iniciated',
  'returned',
  'disappeared',
  'unavailable',
  'scheduled',
  'visited',
  'quit',
  'submitted',
  'approved',
  'denied',
] as const;

const createTargetPropertySchema = z.object({
  huntId: z.string(),
  adURL: z.string(),
  price: z.number(),
  tax: z.number(),

  nickname: z.string().optional(),
  priority: z.number().optional(),
  realtor: z.string().optional(),
  realtorContact: z.string().optional(),

  city: z.string(),
  neighborhood: z.string(),
  province: z.string(),
  country: z.string(),

  block: z.string().optional(),
  street: z.string().optional(),
  lotName: z.string().optional(),
  lotNumber: z.string().optional(),
  postalCode: z.string().optional(),
  lotConvenience: z.string().optional(),
  propertyNumber: z.string().optional(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  propertyConvenience: z.string().optional(),
});

type CreateTargetProperty = z.infer<typeof createTargetPropertySchema>;

const updateTargetPropertySchema = z.object({
  adURL: z.string().optional(),
  price: z.number().optional(),
  tax: z.number().optional(),

  nickname: z.string().optional(),
  priority: z.number().optional(),
  huntingStage: z.enum(HUNTING_STAGE).optional(),
  realtor: z.string().optional(),
  realtorContact: z.string().optional(),
  visitDate: z.string().optional(),

  city: z.string().optional(),
  neighborhood: z.string().optional(),

  block: z.string().optional(),
  street: z.string().optional(),
  lotName: z.string().optional(),
  lotNumber: z.string().optional(),
  postalCode: z.string().optional(),
  lotConvenience: z.string().optional(),
  propertyNumber: z.string().optional(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  propertyConvenience: z.string().optional(),
});

type UpdateTargetProperty = z.infer<typeof updateTargetPropertySchema>;

@ApiTags('targetProperty')
@UseInterceptors(LoggingInterceptor)
@Controller('target-property')
export class TargetPropertyController {
  constructor(private readonly targetPropertyService: TargetPropertyService) {}

  @UsePipes(new ZodValidationPipe(createTargetPropertySchema))
  @Post()
  @ApiOperation({ summary: 'TODO | Cria um novo imóvel target na caçada' })
  async createTargetProperty(
    @Body()
    {
      huntId,
      adURL,
      price,
      tax,
      nickname,
      priority,
      realtor,
      realtorContact,
      lotName,
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      lotConvenience,
      block,
      propertyNumber,
      size,
      rooms,
      bathrooms,
      parking,
      is_front,
      sun,
      condoPricing,
      propertyConvenience,
    }: CreateTargetProperty,
  ) {
    await this.targetPropertyService.createTargetProperty({
      huntId,
      adURL,
      price,
      tax,
      nickname,
      priority,
      realtor,
      realtorContact,
      huntingStage: 'new',
      lotName,
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      lotConvenience,
      block,
      propertyNumber,
      size,
      rooms,
      bathrooms,
      parking,
      is_front,
      sun,
      condoPricing,
      propertyConvenience,
    });
  }

  @Get('/search/:huntId')
  @ApiOperation({
    summary: 'TODO | Busca todos os imóvel targets de uma caçada',
  })
  async getAllTargetsByHunt(@Param('huntId') huntId: string) {
    return await this.targetPropertyService.getAllTargetsByHunt(huntId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'TODO | Busca um imóvel target por id' })
  async getOneTargetProperty(@Param('id') id: string) {
    return await this.targetPropertyService.getOneTargetById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'TODO | Atualiza um imóvel target' })
  async updateTargetProperty(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTargetPropertySchema))
    updateData: UpdateTargetProperty,
  ) {
    return await this.targetPropertyService.updateTargetProperty(
      id,
      updateData,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'TODO | Deleção de um imóvel target' })
  async deleteTargetProperty(@Param('id') id: string) {
    await this.targetPropertyService.deleteTargetProperty(id);
  }
}
