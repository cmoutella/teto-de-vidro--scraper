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

import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { AddressService } from '../services/address.service';
import {
  CreateAddress,
  createAddressSchema,
  SearchAddress,
  searchAddressSchema,
} from '../validation/schemas/address';
import { LotService } from '../services/lot-collection.service';
import {
  CreateLot,
  createLotSchema,
  SearchLots,
  searchLotsSchema,
  UpdateLot,
  updateLotSchema,
} from '../validation/schemas/lot';
import { PropertyService } from '../services/property-collection.service';
import {
  CreateProperty,
  createPropertySchema,
  UpdateProperty,
  updatePropertySchema,
} from '../validation/schemas/property';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Address } from '../schemas/address.schema';
import { Property } from '../schemas/property.schema';
import { Lot } from '../schemas/lot.schema';

@ApiTags('address')
@UseInterceptors(LoggingInterceptor)
@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly lotService: LotService,
    private readonly propertyService: PropertyService,
  ) {}

  /**
   *
   * #####################
   * # Address Endpoints #
   * #####################
   */

  /**
   * CREATE
   */
  @ApiOperation({
    summary: 'Tenta criar lot e property',
    description:
      'A partir das propriedades enviadas busca-se identificar informações mínimas para criar lot e/ou property, caso não estejam criados ainda',
  })
  @ApiBody({
    type: Address,
    description:
      'Todas as possibilidades de dados possíveis para lot ou property',
  })
  @UsePipes(new ZodValidationPipe(createAddressSchema))
  @Post()
  async createAddress(
    @Body()
    {
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
    }: CreateAddress,
  ) {
    return await this.addressService.createAddress({
      lotName,
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      lotConvenience: lotConvenience ?? [],
      block,
      propertyNumber,
      size,
      rooms,
      bathrooms,
      parking,
      is_front,
      sun,
      condoPricing,
      propertyConvenience: propertyConvenience ?? [],
    });
  }

  /**
   * BUSCA DE ENDEREÇOS
   */
  @ApiOperation({ summary: 'TODO | Busca por um endereço' })
  @UsePipes(new ZodValidationPipe(searchAddressSchema))
  @Post('/search')
  async searchByAddress(
    @Body()
    {
      lotName,
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      block,
      propertyNumber,
    }: SearchAddress,
  ) {
    return await this.addressService.findByAddress({
      lotName,
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      block,
      propertyNumber,
    });
  }

  /**
   *
   * #####################
   * # Lots Endpoints #
   * #####################
   */

  /**
   * CREATE
   */
  @ApiOperation({ summary: 'TODO | Criação de lotes' })
  @ApiBody({
    type: Lot,
  })
  @UsePipes(new ZodValidationPipe(createLotSchema))
  @Post('/lot')
  async createLot(
    @Body()
    {
      lotName,
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      lotConvenience,
    }: CreateLot,
  ) {
    await this.lotService.createLot({
      lotName,
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      lotConvenience: lotConvenience ?? [],
    });
  }

  /**
   * GET by ID
   */
  @Get('/lot/:lotId')
  @ApiOperation({ summary: 'TODO | Buscar por lote por id' })
  async getLotById(@Param('id') id: string) {
    return await this.lotService.getOneLot(id);
  }

  /**
   * BUSCA DE LOTES
   */
  @ApiOperation({ summary: 'TODO | Buscar por lotes a partir de um endereço' })
  @UsePipes(new ZodValidationPipe(searchLotsSchema))
  @Post('/lots')
  async findLotsByAddress(
    @Body()
    {
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      block,
    }: SearchLots,
  ) {
    return await this.lotService.getAllLotsByAddress({
      street,
      lotNumber,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      block,
    });
  }

  /**
   * UPDATE
   */
  @Put('/lot/:id')
  @ApiOperation({ summary: 'TODO | Atualizar um lote' })
  async updateLot(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLotSchema))
    updateData: UpdateLot,
  ) {
    return await this.lotService.updateLot(id, updateData);
  }

  /**
   * DELETE
   */
  @Delete('/lot/:id')
  @ApiOperation({ summary: 'TODO | Deleção de lote' })
  async deleteLot(@Param('id') id: string) {
    await this.lotService.deleteLot(id);
  }

  /**
   *
   * #####################
   * # Property Endpoints #
   * #####################
   */

  /**
   * CREATE
   */
  @ApiOperation({ summary: 'TODO | Cria uma propriedade' })
  @ApiBody({
    type: Property,
  })
  @UsePipes(new ZodValidationPipe(createPropertySchema))
  @Post('/property')
  async createProperty(
    @Body()
    {
      mainAddressId,
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
    }: CreateProperty,
  ) {
    await this.propertyService.createProperty({
      mainAddressId,
      block,
      propertyNumber,
      size,
      rooms,
      bathrooms,
      parking,
      is_front,
      sun,
      condoPricing,
      propertyConvenience: propertyConvenience ?? [],
    });
  }

  /**
   * GET
   */
  @Get('/property/:id')
  @ApiOperation({ summary: 'TODO | Busca uma pripridade por id' })
  async getOnePropertyById(@Param('id') id: string) {
    return await this.propertyService.getOneProperty(id);
  }

  /**
   * GET ALL by LOT
   */
  @Get('/main-address/:lotId')
  @ApiOperation({
    summary: 'TODO | Busca todas as propriedades de um lot',
  })
  async getPropertiesByMainAddress(@Param('lotId') lotId: string) {
    return await this.propertyService.getAllPropertiesByMainAddress(lotId);
  }

  /**
   * UDPATE
   */
  @Put(':id')
  @ApiOperation({ summary: 'TODO | Atualiza uma pripridade' })
  async updateProperty(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePropertySchema))
    updateData: UpdateProperty,
  ) {
    return await this.propertyService.updateProperty(id, updateData);
  }

  /**
   * DELETE
   */
  @Delete('/property/:id')
  @ApiOperation({ summary: 'TODO | Deleta uma pripridade' })
  async deleteProperty(@Param('id') id: string) {
    await this.propertyService.deleteProperty(id);
  }
}
