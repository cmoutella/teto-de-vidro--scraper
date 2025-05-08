import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import puppeteer from 'puppeteer-core'

import { sanitizeZap } from '../factory/zapimoveis.factory'
import { extractAddress } from '../utils/extract-address.util'
import { removeBrl } from '../utils/remove-currency.util'

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name)
  chromePath = process.env.CHROME_EXEC_PATH

  isAvailable() {
    if (!this.chromePath) {
      throw new Error('Caminho do Chrome não definido em CHROME_EXEC_PATH')
    }
  }

  async launchBrowser() {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: this.chromePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list'
      ]
    })

    if (!browser) {
      throw new Error('Puppeteer browser unavailable')
    }

    return browser
  }

  async scrapeZap(url: string) {
    const browser = await this.launchBrowser()

    const adData: Record<string, string | string[] | number | boolean> = {}

    try {
      const page = await browser.newPage()
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )
      await page.goto(url, { waitUntil: 'domcontentloaded' })

      /**
       * PREÇO DE
       * VENDA OU ALUGUEL
       */
      const propertyValuesTypes = await page.$$eval(
        '.price-value-wrapper #business-type-info',
        (elements) =>
          elements.map((el) => el.textContent?.trim().toLowerCase() || '')
      )
      const propertyValues = await page.$$eval(
        '.price-info-value',
        (elements) =>
          elements.map((el) => el.textContent?.split('/')[0].trim() || '')
      )

      if (propertyValuesTypes.includes('venda')) {
        const index = propertyValuesTypes.indexOf('venda')
        adData['sellPrice'] = removeBrl(propertyValues[index])
      }
      if (propertyValuesTypes.includes('aluguel')) {
        const index = propertyValuesTypes.indexOf('aluguel')
        adData['rentPrice'] = removeBrl(propertyValues[index])
      }

      /**
       * CONDOMÍNIO
       */
      const condoPricing = await page.$eval(
        '#condo-fee-price',
        (elements) => elements.textContent?.trim() || ''
      )
      if (condoPricing) {
        adData['condoPricing'] = removeBrl(condoPricing)
      }

      /**
       * IPTU
       */
      const iptuPrice = await page.$eval(
        '#iptu-price',
        (elements) => elements.textContent?.trim() || ''
      )
      if (iptuPrice) {
        adData['iptu'] = removeBrl(iptuPrice)
      }

      /**
       * CONDOMÍNIO
       */
      const amenities = await page.$$eval(
        '.amenities-container .amenities-list > .amenities-item',
        (elements) =>
          elements.map((el) => {
            return {
              label: el.getAttribute('itemprop'),
              value: Number(el.textContent?.split(' ')[0].trim()) || undefined
            }
          })
      )
      amenities.forEach((item) => {
        if (item.label && item.value) {
          adData[item.label] = item.value
        } else if (item.label) {
          adData[item.label.toLowerCase()] = true
        }
      })

      /**
       * ENDEREÇO
       */
      const address = await page.$eval(
        '.address-info-value',
        (elements) => elements.textContent?.trim() || ''
      )
      const addressData: Record<string, string | null> = extractAddress(address)

      for (const d in addressData) {
        if (addressData[d]) {
          adData[d] = addressData[d]
        }
      }

      return sanitizeZap(adData)
    } catch (error) {
      this.logger.error(`Erro durante o scraping: ${error}`)
      throw error
    } finally {
      await browser.close()
    }
  }

  getHostScraperFunction(host: string) {
    switch (host) {
      case 'www.zapimoveis.com.br':
        // handle zap imoveis algorithym
        return this.scrapeZap.bind(this)

      default:
        // handle default
        throw new NotFoundException(
          `A busca de dados em ${host} ainda não está disponível.`
        )
    }
  }

  async scrape(url: string) {
    this.isAvailable()

    const host = new URL(url).hostname

    const getData = this.getHostScraperFunction(host)

    const scrapedData = await getData(url)

    return scrapedData
  }
}
