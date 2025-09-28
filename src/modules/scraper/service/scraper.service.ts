import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import puppeteer, { Page } from 'puppeteer-core'

import { sanitizeZap } from '../factory/zapimoveis.factory'
import { extractAddress } from '../utils/extract-address.util'
import { removeBrl } from '../utils/remove-currency.util'

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name)

  async launchBrowser() {
    const executableBrowserPath =
      process.env.BROWSER_EXEC_PATH || '/usr/bin/chromium'

    const browser = await puppeteer.launch({
      headless: !process.env.BROWSER_EXEC_PATH,
      executablePath: executableBrowserPath,
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

  async scrapeZap(url: string, page: Page) {
    const browser = await this.launchBrowser()

    const adData: Record<string, string | string[] | number | boolean> = {}

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' })

      /**
       * PRICES
       */
      // RENTAL
      const rentalPrices = await page.$$eval(
        '.price-info__values-rental > .value-item',
        (elements) =>
          elements.map((el) => {
            const setData = el.querySelectorAll('p')

            const set = []
            setData.forEach((item) => {
              set.push(item.textContent)
            })

            return set
          })
      )
      if (rentalPrices) {
        rentalPrices.forEach((item) => {
          switch (item[0]) {
            case 'Aluguel':
              adData.rentPrice = removeBrl(item[1])
              break

            case 'Condomínio':
              adData.condoPricing = removeBrl(item[1])
              break

            case 'IPTU':
              adData.iptu = removeBrl(item[1])
              break

            default:
              break
          }
        })
      }

      // SELL
      const sellingPrices = await page.$$eval(
        '.price-info__values-sale > .value-item',
        (elements) =>
          elements.map((el) => {
            const setData = el.querySelectorAll('p')

            const set = []
            setData.forEach((item) => {
              set.push(item.textContent)
            })

            return set
          })
      )
      if (sellingPrices) {
        rentalPrices.forEach((item) => {
          switch (item[0]) {
            case 'Venda':
              adData.sellPrice = removeBrl(item[1])
              break

            case 'Condomínio':
              adData.condoPricing = removeBrl(item[1])
              break

            case 'IPTU':
              adData.iptu = removeBrl(item[1])
              break

            default:
              break
          }
        })
      }

      /**
       * FACILIDADES
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
        '.location-address__text',
        (element) => element.textContent?.trim() || ''
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
    const host = new URL(url).hostname

    const getData = await this.getHostScraperFunction(host)

    const browser = await this.launchBrowser()

    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    // Intercepta requisições para bloquear recursos em produção
    if (!process.env.BROWSER_EXEC_PATH) {
      await page.setRequestInterception(true)
      page.on('request', (request) => {
        if (
          ['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1
        ) {
          request.abort()
        } else {
          request.continue()
        }
      })
    }

    const scrapedData = await getData(url, page)

    return scrapedData
  }
}
