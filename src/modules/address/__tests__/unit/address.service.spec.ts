import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { LotRepository } from '../../repositories/lot.repository'
import { AddressService } from '../../services/address.service'

describe.skip('AddressService | UnitTest', () => {
  let service: AddressService

  const mockLotRepository = {
    getOneLotByAddress: jest.fn(),
    getAllLotsByAddress: jest.fn(),
    getAllLotsByCEP: jest.fn(),
    getOneLot: jest.fn(),
    createLot: jest.fn(),
    updateLot: jest.fn(),
    deleteLot: jest.fn()
  }

  const mockPropertyRepository = {
    getAllPropertiesByLotId: jest.fn(),
    getOnePropertyById: jest.fn(),
    getOnePropertyByAddress: jest.fn(),
    createProperty: jest.fn(),
    updateProperty: jest.fn(),
    deleteProperty: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: LotRepository,
          useValue: mockLotRepository
        },
        {
          provide: LotRepository,
          useValue: mockPropertyRepository
        }
      ]
    }).compile()

    jest.clearAllMocks()

    service = module.get<AddressService>(AddressService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe.skip('createAddress', () => {
    it('should return object with lot and property if necessary data received', async () => {})

    it('should return object with ONLY lot if not enough property data', async () => {})

    it('should return falsy if minimal address data NOT received', async () => {})

    it('should call cepService to validate address', async () => {})

    it('should verify if lot already exists with no postalCode', async () => {})

    it('should create lot if NOT already exists', async () => {})

    it('should NOT create lot if already exists', async () => {})

    it('should verify if lot with postalCode already exists', async () => {})

    it('should update postalCode if lot with postalCode NOT exists', async () => {})

    it('should create property if NOT already exists', async () => {})

    it('should NOT create property if already exists', async () => {})
  })

  describe.skip('findByAddress', () => {
    it('should return lots and properties arrays with search results', async () => {})

    it('should return falsy if minimal address data NOT received', async () => {})

    it('should return object with empty lot and property arrays if no lots found', async () => {})

    it('should search for properties if minimal ONE lots found', async () => {})
  })
})
