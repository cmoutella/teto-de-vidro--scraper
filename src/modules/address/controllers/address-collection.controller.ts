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
import { AddressService } from '../services/address-collection.service';

const Address_SUN_LIGHT = ['morning', 'afternoon', 'none'] as const;

const createAddressSchema = z.object({
  block: z.string(),
  address: z.string(),
  lotName: z.string().optional(),
  lotNumber: z.string(),
  postalCode: z.string().optional(),
  cep: z.string().optional(),
  city: z.string(),
  neighborhood: z.string(),
  province: z.string(),
  country: z.string(),
  lotConvenience: z.string().optional(),
  propertyNumber: z.string(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(Address_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  propertyConvenience: z.string().optional(),
});

type CreateAddress = z.infer<typeof createAddressSchema>;

@UseInterceptors(LoggingInterceptor)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UsePipes(new ZodValidationPipe(createAddressSchema))
  @Post()
  async createAddress(
    @Body()
    {
      lotName,
      address,
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
    await this.addressService.createAddress({
      lotName,
      address,
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
}
