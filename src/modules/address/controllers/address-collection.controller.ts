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

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor';
import { ZodValidationPipe } from '../../../shared/pipe/zod-validation.pipe';
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

  @UsePipes(new ZodValidationPipe(searchAddressSchema))
  @Post('/lots')
  async getLotsByAddress(
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
    return await this.addressService.findLotsByAddress({
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

  // Lot subroutes
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

  @Get('/lot/:lotId')
  async getLotById(@Param('id') id: string) {
    return await this.lotService.getOneLot(id);
  }

  @Put('/lot/:id')
  async updateLot(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLotSchema))
    updateData: UpdateLot,
  ) {
    return await this.lotService.updateLot(id, updateData);
  }

  @Delete('/lot/:id')
  async deleteLot(@Param('id') id: string) {
    await this.lotService.deleteLot(id);
  }

  // Property subroutes
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

  @Get(':id')
  async getOnePropertyById(@Param('id') id: string) {
    return await this.propertyService.getOneProperty(id);
  }

  @Put('/property/:id')
  async updateProperty(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePropertySchema))
    updateData: UpdateProperty,
  ) {
    return await this.propertyService.updateProperty(id, updateData);
  }

  @Delete('/property/:id')
  async deleteProperty(@Param('id') id: string) {
    await this.propertyService.deleteProperty(id);
  }
}
