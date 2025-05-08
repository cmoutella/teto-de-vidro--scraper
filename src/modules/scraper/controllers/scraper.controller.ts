import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@src/shared/guards/auth.guard'
import { LoggingInterceptor } from '@src/shared/interceptors/logging.interceptor'

import { AdScrapedData } from '../schema/scraped-data.interface'
import { ScraperService } from '../service/scraper.service'
@ApiTags('scraper')
@UseInterceptors(LoggingInterceptor)
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Realiza o scraper no anúncio do imóvel' })
  @Get()
  async scrapePage(@Query('url') url: string): Promise<AdScrapedData> {
    if (!url) {
      throw new Error('A URL é obrigatória. Use ?url=https://exemplo.com')
    }

    return await this.scraperService.scrape(url)
  }
}
