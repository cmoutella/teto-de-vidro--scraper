import { Controller, Get, Query, UseGuards } from '@nestjs/common'

import { AdScrapedData } from './modules/scraper/schema/scraped-data.interface'
import { ScraperService } from './modules/scraper/service/scraper.service'
import { AuthGuard } from './shared/guards/auth.guard'

@Controller()
export class AppController {
  constructor(private readonly scraperService: ScraperService) {}

  @UseGuards(AuthGuard)
  @Get('/ad')
  async scrapePage(@Query('url') url: string): Promise<AdScrapedData> {
    if (!url) {
      throw new Error('A URL é obrigatória. Use ?url=https://exemplo.com')
    }

    return await this.scraperService.scrape(url)
  }
}
