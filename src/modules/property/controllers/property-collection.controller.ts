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
import { PropertyService } from '../services/property-collection.service';

const PROPERTY_SUN_LIGHT = ['morning', 'afternoon', 'none'] as const;

const createPropertySchema = z.object({
  block: z.string(),
  number: z.string(),
  mainAddressId: z.string(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  convenience: z.array(z.string()).optional(),
});

type CreateProperty = z.infer<typeof createPropertySchema>;

const updatePropertySchema = z.object({
  block: z.string().optional(),
  number: z.string().optional(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  convenience: z.string().optional(),
});

type UpdateProperty = z.infer<typeof updatePropertySchema>;

@UseInterceptors(LoggingInterceptor)
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UsePipes(new ZodValidationPipe(createPropertySchema))
  @Post()
  async createProperty(
    @Body()
    {
      mainAddressId,
      block,
      number,
      size,
      rooms,
      bathrooms,
      parking,
      is_front,
      sun,
      condoPricing,
      convenience,
    }: CreateProperty,
  ) {
    await this.propertyService.createProperty({
      mainAddressId,
      block,
      number,
      size,
      rooms,
      bathrooms,
      parking,
      is_front,
      sun,
      condoPricing,
      convenience: convenience ?? [],
    });
  }

  @Get()
  async getAllProperties(page?: number, limit?: number) {
    return await this.propertyService.getAllProperties(page, limit);
  }

  @Get('/search/:addressId')
  async getAllPropertiesByMainAddress(@Param('addressId') addressId: string) {
    return await this.propertyService.getAllPropertiesByMainAddress(addressId);
  }

  @Get(':id')
  async getOneProperty(@Param('id') id: string) {
    return await this.propertyService.getOneProperty(id);
  }

  @Put(':id')
  async updateProperty(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePropertySchema))
    updateData: UpdateProperty,
  ) {
    return await this.propertyService.updateProperty(id, updateData);
  }

  @Delete(':id')
  async deleteProperty(@Param('id') id: string) {
    await this.propertyService.deleteProperty(id);
  }
}
