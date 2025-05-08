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
import { AmenityOf } from '@src/modules/amenity/schemas/models/amenity.interface'
import { AmenityService } from '@src/modules/amenity/services/amenity.service'
import { AuthGuard } from 'src/shared/guards/auth.guard'

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
  InterfaceTargetProperty,
  TargetAmenity
} from '../schemas/models/target-property.interface'
import { TargetProperty } from '../schemas/target-property.schema'
import {
  CreateTargetProperty,
  createTargetPropertySchema
} from '../schemas/zod-validation/create-target-property.zod-validation'
import {
  UpdateTargetProperty,
  updateTargetPropertySchema
} from '../schemas/zod-validation/update-target-property.zod-validation'
import { TargetPropertyService } from '../services/target-property.service'

@ApiTags('targetProperty')
@UseInterceptors(LoggingInterceptor)
@Controller('target-property')
export class TargetPropertyController {
  constructor(
    private readonly targetPropertyService: TargetPropertyService,
    private readonly huntService: HuntService,
    private readonly amenityService: AmenityService
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
      targetAmenities,
      noComplement,
      block,
      propertyNumber,
      size,
      rooms,
      bathrooms,
      parking,
      is_front,
      sun,
      condoPricing
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
      targetAmenities,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await this.targetPropertyService.preventDuplicity(targetData as never)

    if (targetAmenities && targetAmenities.length >= 1) {
      this.amenityService.createManyAmenities(
        targetAmenities.map((amenity) => {
          return { identifier: amenity.identifier }
        })
      )
    }

    const createdTargetProperty =
      await this.targetPropertyService.createTargetProperty(targetData as never)

    if (!createdTargetProperty) {
      throw new InternalServerErrorException()
    }

    await this.huntService.addTargetToHunt(huntId, createdTargetProperty.id)

    let amenitiesFullData: TargetAmenity[]
    if (
      createdTargetProperty.targetAmenities &&
      createdTargetProperty.targetAmenities.length >= 1
    ) {
      amenitiesFullData = (await this.amenityService.getCompleteAmenitiesData(
        createdTargetProperty.targetAmenities as never
      )) as never
    }

    return { ...createdTargetProperty, targetAmenities: amenitiesFullData }
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

    const updatedTargetProperty =
      await this.targetPropertyService.updateTargetProperty(id, finalData)

    if (!updatedTargetProperty) {
      return undefined
    }

    // TODO: se o endereço atualizar, é preciso atualizar a referencia dos comentários
    // fazer uma função no service de comentários para atualizar manyTargetComments

    let amenitiesFullData: TargetAmenity[]
    if (
      updatedTargetProperty.targetAmenities &&
      updatedTargetProperty.targetAmenities.length >= 1
    ) {
      amenitiesFullData = (await this.amenityService.getCompleteAmenitiesData(
        updatedTargetProperty.targetAmenities as never
      )) as never
    }

    return {
      ...updatedTargetProperty,
      targetAmenities: amenitiesFullData
    } as InterfaceTargetProperty
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

    const target = await this.targetPropertyService.getOneTargetById(id)

    if (!target) {
      return undefined
    }

    let amenitiesFullData: TargetAmenity[]
    if (target.targetAmenities && target.targetAmenities.length >= 1) {
      amenitiesFullData = (await this.amenityService.getCompleteAmenitiesData(
        target.targetAmenities as never
      )) as never
    }

    return { ...target, targetAmenities: amenitiesFullData }
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

    const { list, ...otherData } =
      await this.targetPropertyService.getAllTargetsByHunt(huntId, page, limit)

    let fixedList = []
    if (list && list.length >= 1) {
      fixedList = await Promise.all(
        list.map(async (listItem: InterfaceTargetProperty) => {
          if (
            listItem.targetAmenities &&
            listItem.targetAmenities.length >= 1
          ) {
            const amenitiesFullData =
              (await this.amenityService.getCompleteAmenitiesData(
                listItem.targetAmenities as never
              )) as never

            return { ...listItem, targetAmenities: amenitiesFullData }
          }

          return listItem
        })
      )
    }

    const response = { ...otherData, list: fixedList }

    return response
  }

  @ApiOperation({ summary: 'Adicionar amenidade a um target' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id/amenity')
  async addAmenityToTarget(
    @Param('id') id: string,
    @Body()
    amenity: TargetAmenity & { label?: string; amenityOf?: AmenityOf }
  ) {
    if (!id) {
      throw new BadRequestException('Necessário informar id do target')
    }

    const toBeUpdated = await this.targetPropertyService.getOneTargetById(id)

    if (!toBeUpdated) {
      throw new NotFoundException('Target não encontrado')
    }

    let toBeAdded
    toBeAdded = await this.amenityService.getOneAmenityById(amenity.identifier)

    if (!toBeAdded) {
      toBeAdded = await this.amenityService.createAmenity({
        identifier: amenity.identifier,
        amenityOf: amenity.amenityOf ?? undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        label: amenity.label ?? undefined
      })
    }

    if (toBeAdded) {
      const added = await this.targetPropertyService.addAmenityToTarget(id, {
        identifier: amenity.identifier,
        reportedBy: amenity.reportedBy,
        userId: amenity.userId
      })

      return { success: added }
    }

    return { success: false }
  }

  @ApiOperation({ summary: 'TODO | Remover amenidade de um target' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id/amenity/:amenity')
  async removeAmenityfromTarget(
    @Param('id') id: string,
    @Param('amenity')
    amenity: string
  ) {
    if (!id) {
      throw new BadRequestException('Necessário informar id do target')
    }

    const toBeUpdated = await this.targetPropertyService.getOneTargetById(id)

    if (!toBeUpdated) {
      throw new NotFoundException('Target não encontrado')
    }

    const removed = await this.targetPropertyService.removeAmenityFromTarget(
      id,
      amenity
    )

    return { success: removed }
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
