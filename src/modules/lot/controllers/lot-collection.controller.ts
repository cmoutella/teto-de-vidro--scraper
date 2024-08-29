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
import { LotService } from '../services/lot-collection.service';
import { InterfaceSearchLot } from '../schemas/models/lot.interface';

const createLotSchema = z.object({
  name: z.string().optional(),
  address: z.string(),
  number: z.string(),
  postalCode: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  convenience: z.array(z.string()).optional(),
});

type CreateLot = z.infer<typeof createLotSchema>;

const updateLotSchema = z.object({
  name: z.string().optional(),
  address: z.string(),
  number: z.string(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  convenience: z.array(z.string()).optional(),
});

type UpdateLot = z.infer<typeof updateLotSchema>;

@UseInterceptors(LoggingInterceptor)
@Controller('lots')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @UsePipes(new ZodValidationPipe(createLotSchema))
  @Post()
  async createLot(
    @Body()
    {
      name,
      address,
      number,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      convenience,
    }: CreateLot,
  ) {
    await this.lotService.createLot({
      name,
      address,
      number,
      postalCode,
      neighborhood,
      city,
      province,
      country,
      convenience,
    });
  }

  @Get('/search/:address')
  async getAllLotsByAddress(@Param('address') address: InterfaceSearchLot) {
    return await this.lotService.getAllLotsByAddress(address);
  }

  @Get(':id')
  async getOneLot(@Param('id') id: string) {
    return await this.lotService.getOneLot(id);
  }

  @Put(':id')
  async updateLot(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLotSchema))
    updateData: UpdateLot,
  ) {
    return await this.lotService.updateLot(id, updateData);
  }

  @Delete(':id')
  async deleteLot(@Param('id') id: string) {
    await this.lotService.deleteLot(id);
  }
}
