import { Controller, Get, Query } from '@nestjs/common'

import { AdScrapedData } from '../schema/scraped-data.interface'
import { ScraperService } from '../service/scraper.service'

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  async scrapePage(@Query('url') url: string): Promise<AdScrapedData> {
    if (!url) {
      throw new Error('A URL é obrigatória. Use ?url=https://exemplo.com')
    }

    return await this.scraperService.scrape(url)
  }
}
