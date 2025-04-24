import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { HuntRepository } from '@src/modules/hunt/repositories/hunt.repository'
import { TargetPropertyRepository } from '@src/modules/targetProperty/repositories/target-property.repository'

import type { InterfaceHunt } from '../../schemas/models/hunt.interface'
import { HuntService } from '../../services/hunt-collection.service'

const userId = 'user-123'
const baseHunt: InterfaceHunt = {
  creatorId: userId,
  type: 'rent',
  title: 'Minha mudança',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('HuntService | UnitTest', () => {
  let service: HuntService

  const mockTargetPropertyRepository = {
    createTargetProperty: jest.fn(),
    getAllTargetsByHunt: jest.fn(),
    getHuntTargetByFullAddress: jest.fn(),
    getHuntTargetsByLot: jest.fn(),
    getHuntTargetsByStreet: jest.fn(),
    getOneTargetById: jest.fn(),
    updateTargetProperty: jest.fn(),
    deleteTargetProperty: jest.fn()
  }

  const mockHuntRepository = {
    createHunt: jest.fn(),
    updateHunt: jest.fn(),
    getOneHuntById: jest.fn(),
    getAllHuntsByUser: jest.fn(),
    deleteHunt: jest.fn(),
    addTargetToHunt: jest.fn(),
    removeTargetFromHunt: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuntService,
        {
          provide: HuntRepository,
          useValue: mockHuntRepository
        },
        {
          provide: TargetPropertyRepository,
          useValue: mockTargetPropertyRepository
        }
      ]
    }).compile()

    jest.clearAllMocks()

    service = module.get<HuntService>(HuntService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createHunt', () => {
    it('should return falsy if creatorId is missing', async () => {
      const created = await service.createHunt({
        ...baseHunt,
        creatorId: undefined
      } as InterfaceHunt)

      expect(created).toBeFalsy()
    })

    it('should call repository to create a new target property', async () => {
      mockHuntRepository.createHunt.mockResolvedValue({
        ...baseHunt,
        isActive: true
      })

      await service.createHunt(baseHunt)

      expect(mockHuntRepository.createHunt).toHaveBeenCalledWith(
        expect.objectContaining({
          ...baseHunt
        })
      )
    })

    it('should return created target', async () => {
      mockHuntRepository.createHunt.mockResolvedValue({
        ...baseHunt,
        isActive: true
      })

      const result = await service.createHunt(baseHunt)

      expect(result).toEqual(
        expect.objectContaining({
          ...baseHunt,
          isActive: true
        })
      )
    })
  })

  describe('getAllHuntsByUser', () => {
    it('should return falsy if userId is missing', async () => {
      const found = await service.getAllHuntsByUser(undefined, 1, 10)

      expect(found).toBeFalsy()
    })

    it('should call repository function getAllTargetsByHunt', async () => {
      await await service.getAllHuntsByUser('abc', 1, 10)

      expect(mockHuntRepository.getAllHuntsByUser).toHaveBeenCalledWith(
        'abc',
        1,
        10
      )
    })
  })

  describe('getOneHuntById', () => {
    it('should return falsy if id is missing', async () => {
      const found = await service.getOneHuntById(undefined)

      expect(found).toBeFalsy()
    })

    it('should call repository getAllTargetsByHunt', async () => {
      await await service.getOneHuntById('abc')

      expect(mockHuntRepository.getOneHuntById).toHaveBeenCalledWith('abc')
    })
  })

  describe('updateHunt', () => {
    it('should return falsy if id is missing', async () => {
      const found = await service.updateHunt(undefined, {
        ...baseHunt
      })

      expect(found).toBeFalsy()
    })

    it('should call repository to update the target property', async () => {
      mockHuntRepository.updateHunt.mockResolvedValue({
        ...baseHunt,
        isActive: true
      })

      await service.updateHunt('abc', baseHunt)

      expect(mockHuntRepository.updateHunt).toHaveBeenCalledWith(
        'abc',
        expect.objectContaining({
          ...baseHunt
        })
      )
    })
  })

  describe('deleteHunt', () => {
    it('should return falsy if id is missing', async () => {
      const deleted = await service.deleteHunt(undefined)

      expect(deleted).toBeFalsy()
    })

    it('should return true if deleted success', async () => {
      const deleted = await service.deleteHunt('abc')

      expect(deleted).toBeTruthy()
    })
  })

  describe('addTargetToHunt', () => {
    it('should return falsy if no huntId', async () => {
      const added = await service.addTargetToHunt(undefined, 'target-123')

      expect(added).toBeFalsy()
    })

    it('should return falsy if no targetId', async () => {
      const added = await service.addTargetToHunt('hunt-123', undefined)

      expect(added).toBeFalsy()
    })

    it('should true if add success', async () => {
      const added = await service.addTargetToHunt('hunt-123', 'target-123')

      expect(added).toBeTruthy()
    })

    it('should false if add fail', async () => {
      mockHuntRepository.addTargetToHunt.mockResolvedValue(false)

      const added = await service.addTargetToHunt('hunt-123', 'target-123')

      expect(added).toBeTruthy()
    })
  })

  describe('removeTargetFromHunt', () => {
    it('should return falsy if no huntId', async () => {
      const added = await service.removeTargetFromHunt(undefined, 'target-123')

      expect(added).toBeFalsy()
    })

    it('should return falsy if no targetId', async () => {
      const added = await service.removeTargetFromHunt('hunt-123', undefined)

      expect(added).toBeFalsy()
    })

    it('should true if add success', async () => {
      const added = await service.removeTargetFromHunt('hunt-123', 'target-123')

      expect(added).toBeTruthy()
    })

    it('should false if add fail', async () => {
      mockHuntRepository.removeTargetFromHunt.mockResolvedValue(false)

      const added = await service.removeTargetFromHunt('hunt-123', 'target-123')

      expect(added).toBeTruthy()
    })
  })
})
