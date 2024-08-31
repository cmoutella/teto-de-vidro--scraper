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
  lotName: z.string().optional(),
  street: z.string(),
  lotNumber: z.string(),
  postalCode: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  lotConvenience: z.array(z.string()).optional(),
});

type CreateLot = z.infer<typeof createLotSchema>;

const updateLotSchema = z.object({
  lotName: z.string().optional(),
  street: z.string(),
  lotNumber: z.string(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  lotConvenience: z.array(z.string()).optional(),
});

type UpdateLot = z.infer<typeof updateLotSchema>;

const searchLotSchema = z.object({
  lotNumber: z.string().optional(),
  postalCode: z.string().optional(),
  street: z.string(),
  city: z.string(),
  neighborhood: z.string().optional(),
  province: z.string(),
  country: z.string(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

type SearchLot = z.infer<typeof searchLotSchema>;

@UseInterceptors(LoggingInterceptor)
@Controller('lot')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @UsePipes(new ZodValidationPipe(createLotSchema))
  @Post()
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

  @Post('/search')
  async getAllLotsByAddress(
    @Body(new ZodValidationPipe(searchLotSchema))
    params: SearchLot,
  ) {
    const { page, limit, ...searchParams } = params;
    return await this.lotService.getAllLotsByAddress(
      searchParams as InterfaceSearchLot,
      page,
      limit,
    );
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
