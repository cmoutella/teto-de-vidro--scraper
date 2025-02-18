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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('address')
@UseInterceptors(LoggingInterceptor)
@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly lotService: LotService,
    private readonly propertyService: PropertyService,
  ) {}

  @UsePipes(new ZodValidationPipe(createAddressSchema))
  @Post()
  @ApiOperation({ summary: 'Cria um novo endereço' })
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

  @UsePipes(new ZodValidationPipe(searchAddressSchema))
  @Post('/search')
  @ApiOperation({ summary: 'Busca por um endereço' })
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

  @UsePipes(new ZodValidationPipe(searchLotsSchema))
  @Post('/lots')
  @ApiOperation({ summary: 'Buscar por lotes a partir de um endereço' })
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

  // Lot subroutes
  @UsePipes(new ZodValidationPipe(createLotSchema))
  @Post('/lot')
  @ApiOperation({ summary: 'Criação de lotes' })
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

  @Get('/lot/:lotId')
  @ApiOperation({ summary: 'Buscar por lote por id' })
  async getLotById(@Param('id') id: string) {
    return await this.lotService.getOneLot(id);
  }

  @Put('/lot/:id')
  @ApiOperation({ summary: 'Atualizar um lote' })
  async updateLot(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLotSchema))
    updateData: UpdateLot,
  ) {
    return await this.lotService.updateLot(id, updateData);
  }

  @Delete('/lot/:id')
  @ApiOperation({ summary: 'Deleção de lote' })
  async deleteLot(@Param('id') id: string) {
    await this.lotService.deleteLot(id);
  }

  // Property subroutes
  @UsePipes(new ZodValidationPipe(createPropertySchema))
  @Post('/property')
  @ApiOperation({ summary: 'Cria uma propriedade' })
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

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma pripridade por id' })
  async getOnePropertyById(@Param('id') id: string) {
    return await this.propertyService.getOneProperty(id);
  }

  @Get('/main-address/:lotId')
  @ApiOperation({ summary: 'Busca propriedades a partir de um endereço' })
  async getPropertiesByMainAddress(@Param('lotId') lotId: string) {
    return await this.propertyService.getAllPropertiesByMainAddress(lotId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma pripridade' })
  async updateProperty(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePropertySchema))
    updateData: UpdateProperty,
  ) {
    return await this.propertyService.updateProperty(id, updateData);
  }

  @Delete('/property/:id')
  @ApiOperation({ summary: 'Deleta uma pripridade' })
  async deleteProperty(@Param('id') id: string) {
    await this.propertyService.deleteProperty(id);
  }
}
