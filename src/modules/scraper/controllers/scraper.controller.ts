import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { AuthGuard } from '@src/shared/guards/auth.guard'
import { LoggingInterceptor } from '@src/shared/interceptors/logging.interceptor'

import { AdScrapedData } from '../schema/scraped-data.interface'
import { ScraperService } from '../service/scraper.service'

@UseInterceptors(LoggingInterceptor)
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @UseGuards(AuthGuard)
  @Get()
  async scrapePage(@Query('url') url: string): Promise<AdScrapedData> {
    if (!url) {
      throw new Error('A URL é obrigatória. Use ?url=https://exemplo.com')
    }

    return await this.scraperService.scrape(url)
  }
}
