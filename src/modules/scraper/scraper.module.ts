import { Module } from '@nestjs/common'

import { ScraperController } from './controllers/scraper.controller'
import { ScraperService } from './service/scraper.service'

@Module({
  providers: [ScraperService],
  controllers: [ScraperController]
})
export class ScraperModule {}
