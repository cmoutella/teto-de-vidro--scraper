import {
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { HuntMongooseRepository } from '@src/modules/hunt/repositories/mongoose/hunt.mongoose.repository'
import { HuntService } from '@src/modules/hunt/services/hunt-collection.service'
import { AuthGuard } from '@src/shared/guards/auth.guard'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Types } from 'mongoose'
import { AddressService } from 'src/modules/address/services/address.service'
import { HuntRepository } from 'src/modules/hunt/repositories/hunt.repository'
import { Hunt, HuntSchema } from 'src/modules/hunt/schemas/hunt.schema'
import { MockAuthGuard } from 'test/mocks/mock-auth.guard'

import { TargetPropertyController } from '../../controllers/target-property.controller'
import { TargetPropertyRepository } from '../../repositories/target-property.repository'
import type { InterfaceTargetProperty } from '../../schemas/models/target-property.interface'
import {
  TargetProperty,
  TargetPropertySchema
} from '../../schemas/target-property.schema'
import { TargetPropertyService } from '../../services/target-property.service'

const huntID = new Types.ObjectId().toHexString()
const baseProperty: InterfaceTargetProperty = {
  adURL: '',
  sellPrice: 0,
  rentPrice: 0,
  condoPricing: 0,
  iptu: 0,
  huntId: huntID,
  street: 'Rua A',
  neighborhood: 'Bairro B',
  city: 'Cidade C',
  uf: 'SP',
  country: 'Brasil',
  lotNumber: '123',
  propertyNumber: '456',
  isActive: true,
  huntingStage: 'new',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('TargetPropertyController | Integration Test', () => {
  let controller: TargetPropertyController
  let mongod: MongoMemoryServer

  const mockHuntService = {
    getOneHuntById: jest.fn(),
    addTargetToHunt: jest.fn(),
    removeTargetFromHunt: jest.fn()
  }

  const mockTargetPropertyService = {
    createTargetProperty: jest.fn(),
    preventDuplicity: jest.fn(),
    getOneTargetById: jest.fn(),
    deleteTargetProperty: jest.fn()
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
          { name: TargetProperty.name, schema: TargetPropertySchema },
          { name: Hunt.name, schema: HuntSchema }
        ])
      ],
      controllers: [TargetPropertyController],
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
        {
          provide: AddressService,
          useValue: {
            validateZipCode: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile()

    controller = module.get<TargetPropertyController>(TargetPropertyController)
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
        controller.createTargetProperty({
          ...baseProperty,
          huntId: undefined
        } as InterfaceTargetProperty)
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw NotFoundExecption if no Hunt found for huntId', async () => {
      MockAuthGuard.allow = true

      mockHuntService.getOneHuntById.mockResolvedValue(undefined)

      await expect(
        controller.createTargetProperty({
          ...baseProperty
        } as InterfaceTargetProperty)
      ).rejects.toThrow(NotFoundException)
    })

    it.skip('should throw ConflictException ALREADY_EXISTS if target already exists in hunt', async () => {
      MockAuthGuard.allow = true

      mockTargetPropertyRepository.getHuntTargetByFullAddress.mockResolvedValue(
        true
      )
      mockHuntService.getOneHuntById.mockResolvedValue(true)
      mockTargetPropertyService.createTargetProperty.mockResolvedValue(
        baseProperty
      )
      // TODO: prevent duplicity
      // expect(mockTargetPropertyService.preventDuplicity).toHaveBeenCalled()

      await expect(
        controller.createTargetProperty({
          ...baseProperty
        } as InterfaceTargetProperty)
      ).rejects.toThrow(ConflictException)
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(
        controller.createTargetProperty({
          ...baseProperty
        } as InterfaceTargetProperty)
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('getAllTargetsByHunt', () => {
    it('should throw BadRequestException if huntId is missing', async () => {
      MockAuthGuard.allow = true

      await expect(
        controller.getAllTargetsByHunt(undefined, 1, 10)
      ).rejects.toThrow(BadRequestException)
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(controller.getAllTargetsByHunt(huntID)).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe('getOneTargetById', () => {
    it('should throw BadRequestException if id is missing', async () => {
      MockAuthGuard.allow = true

      await expect(controller.getOneTargetProperty(undefined)).rejects.toThrow(
        BadRequestException
      )
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(controller.getOneTargetProperty('abc')).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe('updateTargetProperty', () => {
    it('should throw BadRequestException if id is missing', async () => {
      MockAuthGuard.allow = true
      await expect(
        controller.updateTargetProperty(undefined, {
          ...baseProperty
        } as InterfaceTargetProperty)
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw NotFoundException if no Target found for the id', async () => {
      MockAuthGuard.allow = true
      mockTargetPropertyService.getOneTargetById(false)

      await expect(
        controller.updateTargetProperty('abc', {
          ...baseProperty
        } as InterfaceTargetProperty)
      ).rejects.toThrow(NotFoundException)
    })

    it.skip('should throw ConflictException ALREADY_EXISTS if target already exists in hunt', () => {
      // TODO: test preventDuplicity
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(
        controller.updateTargetProperty('abc', {
          ...baseProperty
        } as InterfaceTargetProperty)
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('deleteTargetProperty', () => {
    it('should throw BadRequestException if id is missing', async () => {
      await expect(controller.deleteTargetProperty(undefined)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should throw NotFoundExceptions if no Target found for the id', async () => {
      mockTargetPropertyService.getOneTargetById(false)

      await expect(controller.deleteTargetProperty('abc')).rejects.toThrow(
        NotFoundException
      )
    })

    it('should remove target from hunt if delete success', async () => {
      mockTargetPropertyService.getOneTargetById.mockResolvedValue({
        huntId: 'h123'
      })
      mockTargetPropertyService.deleteTargetProperty.mockResolvedValue(true)

      await controller.deleteTargetProperty('abc')
      expect(mockHuntService.removeTargetFromHunt).toHaveBeenCalled()
    })

    it.skip('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await expect(controller.deleteTargetProperty('abc')).rejects.toThrow(
        BadRequestException
      )
    })
  })
})
