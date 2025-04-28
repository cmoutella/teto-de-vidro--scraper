import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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
import { PROPERTY_SUN_LIGHT } from 'src/shared/const'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { z } from 'zod'

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor'
import { ZodValidationPipe } from '../../../shared/pipe/zod-validation.pipe'
import { HuntService } from '../../hunt/services/hunt-collection.service'
import { CreateTargetPropertySuccess } from '../schemas/endpoints/create'
import { DeleteTargetPropertySuccess } from '../schemas/endpoints/delete'
import {
  GetOneTargetPropertySuccess,
  GetTargetPropertiesByHuntSuccess
} from '../schemas/endpoints/get'
import {
  addressRelatedFields,
  InterfaceTargetProperty
} from '../schemas/models/target-property.interface'
import { TargetProperty } from '../schemas/target-property.schema'
import { TargetPropertyService } from '../services/target-property.service'

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
  'denied'
] as const

const createTargetPropertySchema = z.object({
  huntId: z.string(),
  adURL: z.string(),
  sellPrice: z.number(),
  rentPrice: z.number(),
  iptu: z.number().optional(),

  nickname: z.string().optional(),
  street: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  uf: z.string(),
  country: z.string(),
  postalCode: z.string().optional(),
  condoPricing: z.number().optional(),

  lotName: z.string().optional(),
  noLotNumber: z.boolean(),
  lotNumber: z.string().optional(),
  lotConvenience: z.array(z.string()).optional(),

  noComplement: z.boolean(),
  block: z.string().optional(),
  propertyNumber: z.string().optional(),

  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  propertyConvenience: z.array(z.string()).optional(),

  contactName: z.string().optional(),
  contactWhatzap: z.string().optional()
})

type CreateTargetProperty = z.infer<typeof createTargetPropertySchema>

const updateTargetPropertySchema = z.object({
  nickname: z.string().optional(),
  priority: z.number().optional(),
  huntingStage: z.enum(HUNTING_STAGE).optional(),
  isActive: z.boolean().optional(),
  contactName: z.string().optional(),
  contactWhatzap: z.string().optional(),
  visitDate: z.string().optional(),

  sellPrice: z.number().optional(),
  rentPrice: z.number().optional(),
  iptu: z.number().optional(),
  condoPricing: z.number().optional(),

  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  uf: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),

  lotName: z.string().optional(),
  noLotNumber: z.boolean().optional(),
  lotNumber: z.string().optional(),
  lotConvenience: z.array(z.string()).optional(),

  noComplement: z.boolean().optional(),
  block: z.string().optional(),
  propertyNumber: z.string().optional(),

  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  propertyConvenience: z.array(z.string()).optional()
})

type UpdateTargetProperty = z.infer<typeof updateTargetPropertySchema>

@ApiTags('targetProperty')
@UseInterceptors(LoggingInterceptor)
@Controller('target-property')
export class TargetPropertyController {
  constructor(
    private readonly targetPropertyService: TargetPropertyService,
    private readonly huntService: HuntService
  ) {}

  @ApiOperation({ summary: 'Cria um novo imóvel target na caçada' })
  @ApiBody({
    type: TargetProperty
  })
  @ApiResponse({
    type: CreateTargetPropertySuccess,
    status: 201,
    description: 'Sucesso ao criar Imóvel de interesse'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createTargetPropertySchema))
  @Post()
  async createTargetProperty(
    @Body()
    {
      huntId,
      adURL,
      sellPrice,
      rentPrice,
      iptu,
      nickname,
      contactName,
      contactWhatzap,
      lotName,
      street,
      noLotNumber,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      uf,
      country,
      lotConvenience,
      noComplement,
      block,
      propertyNumber,
      size,
      rooms,
      bathrooms,
      parking,
      is_front,
      sun,
      condoPricing,
      propertyConvenience
    }: CreateTargetProperty
  ) {
    if (!huntId) {
      throw new BadRequestException('É necessário vincular a uma huntId')
    }

    const hunt = await this.huntService.getOneHuntById(huntId)

    if (!hunt) {
      throw new NotFoundException('A hunt informada não existe')
    }

    const targetData = {
      huntId,
      adURL,
      sellPrice,
      rentPrice,
      iptu,
      nickname,
      contactName,
      contactWhatzap,
      huntingStage: 'new',
      lotName,
      street,
      noLotNumber,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      uf,
      country,
      lotConvenience,
      noComplement,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await this.targetPropertyService.preventDuplicity(targetData as never)

    const createdTargetProperty =
      await this.targetPropertyService.createTargetProperty(targetData as never)

    if (!createdTargetProperty) {
      throw new InternalServerErrorException()
    }

    await this.huntService.addTargetToHunt(huntId, createdTargetProperty.id)

    return createdTargetProperty
  }

  @ApiOperation({ summary: 'Busca um imóvel target por id' })
  @ApiResponse({
    type: GetOneTargetPropertySuccess,
    status: 200
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getOneTargetProperty(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Necessário informar id')
    }

    return await this.targetPropertyService.getOneTargetById(id)
  }

  @ApiOperation({ summary: 'Atualiza um imóvel target' })
  @ApiBody({
    type: TargetProperty
  })
  @ApiResponse({ type: CreateTargetPropertySuccess, status: 200 })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateTargetProperty(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTargetPropertySchema))
    updateData: UpdateTargetProperty
  ) {
    if (!id) {
      throw new BadRequestException('Necessário informar id do target')
    }

    const currentData = await this.targetPropertyService.getOneTargetById(id)

    if (!currentData) {
      throw new NotFoundException('Target não encontrado')
    }

    const changedData: Partial<InterfaceTargetProperty> = {}

    for (const key in updateData) {
      if (
        updateData[key] !== currentData[key] &&
        updateData[key] != null &&
        updateData[key] != undefined
      ) {
        changedData[key] = updateData[key]
      }
    }

    const finalData: InterfaceTargetProperty = {
      ...currentData,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    const hasAddressUpdate = Object.keys(changedData).some((key) =>
      addressRelatedFields.includes(key as never)
    )
    if (hasAddressUpdate) {
      await this.targetPropertyService.preventDuplicity(finalData)
    }

    return await this.targetPropertyService.updateTargetProperty(id, finalData)
  }

  @ApiOperation({
    summary: 'Busca todos os imóvel targets de uma caçada'
  })
  @ApiResponse({ type: GetTargetPropertiesByHuntSuccess, status: 200 })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/search/:huntId')
  async getAllTargetsByHunt(
    @Param('huntId') huntId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    if (!huntId) {
      throw new BadRequestException('Necessário informar huntId')
    }

    return await this.targetPropertyService.getAllTargetsByHunt(
      huntId,
      page,
      limit
    )
  }

  @ApiOperation({ summary: 'Deleção de um imóvel target' })
  @ApiResponse({
    type: DeleteTargetPropertySuccess,
    status: 200
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTargetProperty(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Necessário informar id do target')
    }

    const toDelete = await this.targetPropertyService.getOneTargetById(id)

    if (!toDelete) {
      throw new NotFoundException('Target não encontrado')
    }

    const deleted = await this.targetPropertyService.deleteTargetProperty(id)

    if (deleted) {
      await this.huntService.removeTargetFromHunt(toDelete.huntId, id)
    }
  }
}
