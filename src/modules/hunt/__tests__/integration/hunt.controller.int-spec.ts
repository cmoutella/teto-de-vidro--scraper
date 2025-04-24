import { BadRequestException, NotFoundException } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TargetPropertyRepository } from '@src/modules/targetProperty/repositories/target-property.repository'
import {
  TargetProperty,
  TargetPropertySchema
} from '@src/modules/targetProperty/schemas/target-property.schema'
import { TargetPropertyService } from '@src/modules/targetProperty/services/target-property.service'
import { UserService } from '@src/modules/user/services/user.service'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Types } from 'mongoose'
import { HuntRepository } from 'src/modules/hunt/repositories/hunt.repository'
import { HuntMongooseRepository } from 'src/modules/hunt/repositories/mongoose/hunt.mongoose.repository'
import { Hunt, HuntSchema } from 'src/modules/hunt/schemas/hunt.schema'
import { HuntService } from 'src/modules/hunt/services/hunt-collection.service'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { MockAuthGuard } from 'test/mocks/mock-auth.guard'

import { HuntController } from '../../controllers/hunt-collection.controller'
import type { InterfaceHunt } from '../../schemas/models/hunt.interface'

const userId = new Types.ObjectId().toHexString()
const mockTargets = ['target-1', 'target-2']
const huntMock: InterfaceHunt = {
  creatorId: userId,
  type: 'buy',
  title: 'Test Hunt',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

/**
 * TODO
 * - testar autenticação
 * - testar validação com zod
 */
describe('HuntController | Integration Test', () => {
  let controller: HuntController
  let mongod: MongoMemoryServer

  const mockHuntService = {
    createHunt: jest.fn(),
    updateHunt: jest.fn(),
    getOneHuntById: jest.fn(),
    getAllHuntsByUser: jest.fn(),
    deleteHunt: jest.fn(),
    addTargetToHunt: jest.fn(),
    removeTargetFromHunt: jest.fn()
  }

  const mockTargetPropertyService = {
    deleteTargetProperty: jest.fn()
  }

  const mockUserService = {
    getById: jest.fn()
  }

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

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: Hunt.name, schema: HuntSchema },
          { name: TargetProperty.name, schema: TargetPropertySchema }
        ])
      ],
      controllers: [HuntController],
      providers: [
        {
          provide: TargetPropertyService,
          useValue: mockTargetPropertyService
        },
        {
          provide: HuntService,
          useValue: mockHuntService
        },
        {
          provide: TargetPropertyRepository,
          useValue: mockTargetPropertyRepository
        },
        {
          provide: HuntRepository,
          useClass: HuntMongooseRepository
        },
        { provide: UserService, useValue: mockUserService }
      ]
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile()

    jest.clearAllMocks()

    controller = module.get<HuntController>(HuntController)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
  })

  it('should be defined', () => {
    MockAuthGuard.allow = true
    expect(controller).toBeDefined()
  })

  describe('createTargetProperty', () => {
    it('should throw BadRequestException if huntId is missing', async () => {
      MockAuthGuard.allow = true

      await expect(
        controller.createHunt({
          ...huntMock,
          creatorId: undefined
        } as InterfaceHunt)
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw NotFoundExecption if no User found for userId', async () => {
      MockAuthGuard.allow = true

      mockUserService.getById.mockResolvedValue(undefined)

      await expect(
        controller.createHunt({
          ...huntMock
        } as InterfaceHunt)
      ).rejects.toThrow(NotFoundException)
      expect(mockUserService.getById).toHaveBeenCalled()
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(
        controller.createHunt({
          ...huntMock
        } as InterfaceHunt)
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('getAllHuntsByUser', () => {
    it('should throw BadRequestException if huntId is missing', async () => {
      MockAuthGuard.allow = true

      await expect(
        controller.getAllHuntsByUser(undefined, 1, 10)
      ).rejects.toThrow(BadRequestException)
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(controller.getAllHuntsByUser(userId)).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe('getOneHuntById', () => {
    it('should throw BadRequestException if id is missing', async () => {
      MockAuthGuard.allow = true

      await expect(controller.getOneHuntById(undefined)).rejects.toThrow(
        BadRequestException
      )
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(controller.getOneHuntById('abc')).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe('updateHunt', () => {
    it('should throw BadRequestException if id is missing', async () => {
      MockAuthGuard.allow = true

      await expect(
        controller.updateHunt(undefined, {
          ...huntMock
        } as InterfaceHunt)
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw NotFoundException if no Target found for the id', async () => {
      MockAuthGuard.allow = true

      mockHuntService.getOneHuntById(false)

      await expect(
        controller.updateHunt('abc', {
          ...huntMock
        } as InterfaceHunt)
      ).rejects.toThrow(NotFoundException)
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(
        controller.updateHunt('abc', {
          ...huntMock
        } as InterfaceHunt)
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('deleteTargetProperty', () => {
    it('should throw BadRequestException if id is missing', async () => {
      await expect(controller.deleteHunt(undefined)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should throw NotFoundExceptions if no Target found for the id', async () => {
      mockHuntService.getOneHuntById.mockResolvedValue(false)

      await expect(controller.deleteHunt('abc')).rejects.toThrow(
        NotFoundException
      )
    })

    it('should NOT remove hunt targets when hunt delete fails', async () => {
      mockHuntService.getOneHuntById.mockResolvedValue({
        targets: mockTargets
      })

      mockHuntService.deleteHunt.mockResolvedValue(false)

      await controller.deleteHunt('abc')
      expect(
        mockTargetPropertyService.deleteTargetProperty
      ).not.toHaveBeenCalled()
    })

    it('should remove hunt targets when hunt delete succedded', async () => {
      mockHuntService.getOneHuntById.mockResolvedValue({
        targets: mockTargets
      })

      mockHuntService.deleteHunt.mockResolvedValue(true)

      await controller.deleteHunt('abc')
      expect(
        mockTargetPropertyService.deleteTargetProperty
      ).toHaveBeenCalledTimes(mockTargets.length)
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(controller.deleteHunt('abc')).rejects.toThrow(
        BadRequestException
      )
    })
  })
})
