import { Controller, Get, Query } from '@nestjs/common'

import { AdScrapedData } from './modules/scraper/schema/scraped-data.interface'
import { ScraperService } from './modules/scraper/service/scraper.service'

@Controller()
export class AppController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  async scrapePage(@Query('url') url: string): Promise<AdScrapedData> {
    if (!url) {
      throw new Error('A URL é obrigatória. Use ?url=https://exemplo.com')
    }

    return await this.scraperService.scrape(url)
  }
}
