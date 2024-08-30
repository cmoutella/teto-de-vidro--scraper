import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor';
import { ZodValidationPipe } from '../../../shared/pipe/zod-validation.pipe';
import { AddressService } from '../services/address-collection.service';
import { PROPERTY_SUN_LIGHT } from 'src/shared/const';

const createAddressSchema = z.object({
  block: z.string().optional(),
  street: z.string(),
  lotName: z.string().optional(),
  lotNumber: z.string(),
  postalCode: z.string().optional(),
  city: z.string(),
  neighborhood: z.string(),
  province: z.string(),
  country: z.string(),
  lotConvenience: z.array(z.string()).optional(),
  propertyNumber: z.string(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  propertyConvenience: z.array(z.string()).optional(),
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
}
