import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { AmenityRepository } from '../../repositories/amenity.repository'
import type { InterfaceAmenity } from '../../schemas/models/amenity.interface'
import { AmenityService } from '../../services/amenity.service'

const baseAmenity: InterfaceAmenity = {
  id: 'elevator',
  label: 'Elevador',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const otherAmenity: InterfaceAmenity = {
  id: 'portaria-24h',
  label: 'Portaria 24h',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('HuntService | UnitTest', () => {
  let service: AmenityService

  const mockAmenityRepository = {
    createAmenity: jest.fn(),
    createManyAmenities: jest.fn(),
    updateAmenity: jest.fn(),
    getOneAmenityById: jest.fn(),
    getOneAmenityByLabel: jest.fn(),
    deleteAmenity: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmenityService,
        {
          provide: AmenityRepository,
          useValue: mockAmenityRepository
        }
      ]
    }).compile()

    jest.clearAllMocks()

    service = module.get<AmenityService>(AmenityService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createAmenity', () => {
    it('should call repository to create a new target property', async () => {
      mockAmenityRepository.createAmenity.mockResolvedValue({
        ...baseAmenity,
        isActive: true
      })

      await service.createAmenity(baseAmenity)

      expect(mockAmenityRepository.createAmenity).toHaveBeenCalledWith(
        expect.objectContaining({
          ...baseAmenity
        })
      )
    })

    it('should return created target', async () => {
      mockAmenityRepository.createAmenity.mockResolvedValue({
        ...baseAmenity,
        isActive: true
      })

      const result = await service.createAmenity(baseAmenity)

      expect(result).toEqual(
        expect.objectContaining({
          ...baseAmenity,
          isActive: true
        })
      )
    })
  })

  describe('createManyAmenities', () => {
    const many = [baseAmenity, otherAmenity]

    it('should call repository to create a new target property', async () => {
      mockAmenityRepository.createManyAmenities.mockResolvedValue({
        success: [many[0].id, many[1].id],
        failed: []
      })

      await service.createManyAmenities(many)

      expect(mockAmenityRepository.createManyAmenities).toHaveBeenCalled()
    })

    it('should return created target', async () => {
      mockAmenityRepository.createManyAmenities.mockResolvedValue({
        success: [many[0].id, many[1].id],
        failed: []
      })

      const result = await service.createManyAmenities(many)

      expect(result).toEqual(
        expect.objectContaining({
          success: [many[0].id, many[1].id],
          failed: []
        })
      )
    })
  })

  describe('getOneAmenityById', () => {
    it('should return falsy if id is missing', async () => {
      const found = await service.getOneAmenityById(undefined)

      expect(found).toBeFalsy()
    })

    it('should call repository getOneAmenityById', async () => {
      mockAmenityRepository.getOneAmenityById.mockReturnValue(baseAmenity)
      await service.getOneAmenityById('abc')

      expect(mockAmenityRepository.getOneAmenityById).toHaveBeenCalledWith(
        'abc'
      )
    })
  })

  describe('updateAmenity', () => {
    it('should return falsy if id is missing', async () => {
      const found = await service.updateAmenity(undefined, {
        ...baseAmenity
      })

      expect(found).toBeFalsy()
    })

    it('should call repository to update the target property', async () => {
      mockAmenityRepository.updateAmenity.mockResolvedValue({
        ...baseAmenity,
        label: 'Teste'
      })

      await service.updateAmenity('abc', baseAmenity)

      expect(mockAmenityRepository.updateAmenity).toHaveBeenCalledWith(
        'abc',
        expect.objectContaining({
          ...baseAmenity
        })
      )
    })
  })

  describe('deleteAmenity', () => {
    it('should return falsy if id is missing', async () => {
      const deleted = await service.deleteAmenity(undefined)

      expect(deleted).toBeFalsy()
    })

    it('should return true if deleted success', async () => {
      const deleted = await service.deleteAmenity('abc')

      expect(deleted).toBeTruthy()
    })
  })
})
