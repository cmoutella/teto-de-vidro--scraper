import type { INestApplication } from '@nestjs/common'
import {
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import {
  Amenity,
  AmenitySchema
} from '@src/modules/amenity/schemas/amenity.schema'
import { AmenityService } from '@src/modules/amenity/services/amenity.service'
import { HuntMongooseRepository } from '@src/modules/hunt/repositories/mongoose/hunt.mongoose.repository'
import { HuntService } from '@src/modules/hunt/services/hunt-collection.service'
import { AuthGuard } from '@src/shared/guards/auth.guard'
import { ResponseInterceptor } from '@src/shared/interceptors/response.interceptor'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Types } from 'mongoose'
import { AddressService } from 'src/modules/address/services/address.service'
import { HuntRepository } from 'src/modules/hunt/repositories/hunt.repository'
import { Hunt, HuntSchema } from 'src/modules/hunt/schemas/hunt.schema'
import request from 'supertest'
import { MockAuthGuard } from 'test/mocks/mock-auth.guard'

import { amenity1, manyAmenities } from '../__mocks__'
import { TargetPropertyController } from '../../controllers/target-property.controller'
import { TargetPropertyRepository } from '../../repositories/target-property.repository'
import type {
  InterfaceTargetProperty,
  TargetAmenity
} from '../../schemas/models/target-property.interface'
import {
  TargetProperty,
  TargetPropertySchema
} from '../../schemas/target-property.schema'
import { TargetPropertyService } from '../../services/target-property.service'

const huntID = new Types.ObjectId().toHexString()
const targetId = new Types.ObjectId().toHexString()
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
  noLotNumber: false,
  lotNumber: '123',
  noComplement: false,
  propertyNumber: '456',
  isActive: true,
  huntingStage: 'new',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

/**
 * TODO
 * - testar validação com zod
 */
describe('TargetPropertyController | Integration Test', () => {
  let controller: TargetPropertyController
  let mongod: MongoMemoryServer
  let app: INestApplication

  const mockHuntService = {
    getOneHuntById: jest.fn(),
    addTargetToHunt: jest.fn(),
    removeTargetFromHunt: jest.fn()
  }

  const mockTargetPropertyService = {
    createTargetProperty: jest.fn(),
    updateTargetProperty: jest.fn(),
    getOneTargetById: jest.fn(),
    getAllTargetsByHunt: jest.fn(),
    addAmenityToTarget: jest.fn(),
    removeAmenityfromTarget: jest.fn(),
    preventDuplicity: jest.fn(),
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

  const mockAmenityService = {
    createManyAmenities: jest.fn(),
    getOneAmenityById: jest.fn(),
    getCompleteAmenitiesData: jest.fn()
  }

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: TargetProperty.name, schema: TargetPropertySchema },
          { name: Hunt.name, schema: HuntSchema },
          { name: Amenity.name, schema: AmenitySchema }
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
          provide: AmenityService,
          useValue: mockAmenityService
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
    app = module.createNestApplication()
    app.useGlobalInterceptors(new ResponseInterceptor())
    await app.init()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
    await app.close()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createTargetProperty', () => {
    it('should return created target if success', async () => {
      MockAuthGuard.allow = true

      mockHuntService.getOneHuntById.mockResolvedValue(true)
      mockTargetPropertyService.createTargetProperty.mockResolvedValue({
        ...baseProperty,
        id: 'target-123'
      })

      await request(app.getHttpServer())
        .post('/target-property')
        .send({
          ...baseProperty
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('status')
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('id')
        })
    })

    it('should return validation error if zod validation failed', async () => {
      MockAuthGuard.allow = true

      await request(app.getHttpServer())
        .post('/target-property')
        .send({
          ...baseProperty,
          huntId: undefined
        } as InterfaceTargetProperty)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message')
          expect(res.body).toHaveProperty('error')
        })
    })

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

    it('should test for duplicity within the hunt', async () => {
      MockAuthGuard.allow = true

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      await request(app.getHttpServer())
        .post('/target-property')
        .send({
          ...baseProperty
        })

      expect(mockTargetPropertyService.preventDuplicity).toHaveBeenCalled()
    })

    it('should throw ConflictException ALREADY_EXISTS if target already exists in hunt', async () => {
      MockAuthGuard.allow = true

      mockHuntService.getOneHuntById.mockResolvedValue(true)

      mockTargetPropertyService.preventDuplicity.mockImplementation(() => {
        throw new ConflictException({ message: 'ALREADY_EXISTS' })
      })

      await request(app.getHttpServer())
        .post('/target-property')
        .send({
          ...baseProperty
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('ALREADY_EXISTS')
        })
    })

    it('should try to create received amenities', async () => {
      MockAuthGuard.allow = true

      mockHuntService.getOneHuntById.mockResolvedValue(true)
      mockTargetPropertyService.createTargetProperty.mockResolvedValue({
        ...baseProperty,
        id: 'target-123'
      })

      await request(app.getHttpServer())
        .post('/target-property')
        .send({
          ...baseProperty,
          targetAmenities: [
            { identifier: 'elevator', reportedBy: 'ad' },
            { identifier: 'portaria-24h', reportedBy: 'ad' }
          ] as TargetAmenity[]
        })

      expect(mockAmenityService.createManyAmenities).toHaveBeenCalled()
    })

    it('should try NOT to create if NO amenities were received', async () => {
      MockAuthGuard.allow = true

      mockHuntService.getOneHuntById.mockResolvedValue(true)
      mockTargetPropertyService.createTargetProperty.mockResolvedValue({
        ...baseProperty,
        id: 'target-123'
      })

      await request(app.getHttpServer())
        .post('/target-property')
        .send({
          ...baseProperty
        })

      expect(mockAmenityService.createManyAmenities).not.toHaveBeenCalled()
    })

    it('should get amenities origin data', async () => {
      MockAuthGuard.allow = true

      mockHuntService.getOneHuntById.mockResolvedValue(true)
      mockTargetPropertyService.createTargetProperty.mockResolvedValue({
        ...baseProperty,
        id: 'target-123',
        targetAmenities: manyAmenities
      })

      await request(app.getHttpServer())
        .post('/target-property')
        .send({
          ...baseProperty,
          targetAmenities: manyAmenities
        })

      expect(mockAmenityService.getCompleteAmenitiesData).toHaveBeenCalled()
    })

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .post('/target-property')
        .send({
          ...baseProperty
        })
        .expect(403)
    })
  })

  describe('updateTargetProperty', () => {
    it('should throw NotFoundException if no Target found for the id', async () => {
      MockAuthGuard.allow = true
      mockTargetPropertyService.getOneTargetById.mockResolvedValue(false)

      await expect(
        controller.updateTargetProperty('abc', {
          ...baseProperty
        } as InterfaceTargetProperty)
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw BadRequestException if id is missing', async () => {
      MockAuthGuard.allow = true
      await expect(
        controller.updateTargetProperty(undefined, {
          ...baseProperty
        } as InterfaceTargetProperty)
      ).rejects.toThrow(BadRequestException)
    })

    it('should NOT call preventDuplicity if address info NOT changed', async () => {
      MockAuthGuard.allow = true
      mockTargetPropertyService.getOneTargetById.mockResolvedValue({
        ...baseProperty
      })

      await controller.updateTargetProperty('abc', {
        ...baseProperty,
        nickname: 'ChangedName'
      } as InterfaceTargetProperty)

      await expect(
        mockTargetPropertyService.preventDuplicity
      ).not.toHaveBeenCalled()
    })

    it('should call preventDuplicity if address info changed', async () => {
      MockAuthGuard.allow = true
      mockTargetPropertyService.getOneTargetById.mockResolvedValue({
        ...baseProperty
      })

      mockTargetPropertyService.preventDuplicity.mockResolvedValue(true)

      await controller.updateTargetProperty('abc', {
        ...baseProperty,
        street: 'Rua dos bobos'
      } as InterfaceTargetProperty)

      await expect(
        mockTargetPropertyService.preventDuplicity
      ).toHaveBeenCalled()
    })

    it('should throw ConflictException ALREADY_EXISTS if target already exists in hunt', async () => {
      MockAuthGuard.allow = true

      mockTargetPropertyService.getOneTargetById.mockResolvedValue(baseProperty)

      mockTargetPropertyService.preventDuplicity.mockImplementation(() => {
        throw new ConflictException({ message: 'ALREADY_EXISTS' })
      })

      await request(app.getHttpServer())
        .put(`/target-property/${targetId}`)
        .send({
          ...baseProperty,
          street: 'Rua dos bobos'
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('ALREADY_EXISTS')
        })
    })

    it('should get amenities origin data', async () => {
      MockAuthGuard.allow = true

      mockTargetPropertyService.getOneTargetById.mockResolvedValue(true)
      mockTargetPropertyService.updateTargetProperty.mockResolvedValue({
        ...baseProperty,
        condoPricing: 700,
        targetAmenities: manyAmenities
      })

      await request(app.getHttpServer())
        .put('/target-property/target-123')
        .send({
          ...baseProperty,
          condoPricing: 700,
          targetAmenities: manyAmenities
        })

      expect(mockAmenityService.getCompleteAmenitiesData).toHaveBeenCalled()
    })

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .put(`/target-property/${targetId}`)
        .send({
          ...baseProperty
        })
        .expect(403)
    })
  })

  describe('getOneTargetById', () => {
    it('should throw BadRequestException if id is missing', async () => {
      MockAuthGuard.allow = true

      await expect(controller.getOneTargetProperty(undefined)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should get amenities origin data', async () => {
      MockAuthGuard.allow = true

      mockTargetPropertyService.getOneTargetById.mockResolvedValue({
        ...baseProperty,
        condoPricing: 700,
        targetAmenities: manyAmenities
      })

      await request(app.getHttpServer())
        .get('/target-property/target-123')
        .send()

      expect(mockAmenityService.getCompleteAmenitiesData).toHaveBeenCalled()
    })

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .get(`/target-property/${targetId}`)
        .send()
        .expect(403)
    })
  })

  describe('addAmenityToTarget', () => {
    it('should throw BadRequestException if id is missing', async () => {
      await expect(
        controller.addAmenityToTarget(undefined, amenity1)
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw NotFoundException if id is missing', async () => {
      await expect(
        controller.addAmenityToTarget(targetId, amenity1)
      ).rejects.toThrow(NotFoundException)
    })

    it('should call service with correct params', async () => {
      MockAuthGuard.allow = true

      mockTargetPropertyService.getOneTargetById.mockResolvedValue(true)

      await request(app.getHttpServer())
        .put(`/target-property/${targetId}/amenity`)
        .send(amenity1)

      expect(mockTargetPropertyService.addAmenityToTarget).toHaveBeenCalled()
      expect(mockTargetPropertyService.addAmenityToTarget).toHaveBeenCalledWith(
        targetId,
        amenity1
      )
    })
  })

  describe('removeAmenityfromTarget', () => {
    it('should throw BadRequestException if id is missing', async () => {
      MockAuthGuard.allow = true

      await expect(
        controller.removeAmenityfromTarget(undefined, amenity1.identifier)
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

    it('should get query params', async () => {
      MockAuthGuard.allow = true

      mockTargetPropertyService.getAllTargetsByHunt.mockResolvedValue({
        list: baseProperty
      })

      await request(app.getHttpServer())
        .get(`/target-property/search/${huntID}?page=3&limit=10`)
        .send()

      expect(
        mockTargetPropertyService.getAllTargetsByHunt
      ).toHaveBeenCalledWith(huntID, '3', '10')
    })

    it('should get amenities origin data', async () => {
      MockAuthGuard.allow = true

      const responseMock = [
        {
          ...baseProperty,
          id: '1',
          targetAmenities: manyAmenities
        },
        {
          ...baseProperty,
          id: '2',
          targetAmenities: manyAmenities
        }
      ]

      mockTargetPropertyService.getAllTargetsByHunt.mockResolvedValue({
        list: responseMock
      })

      await request(app.getHttpServer())
        .get('/target-property/search/hunt-123')
        .send()

      expect(mockAmenityService.getCompleteAmenitiesData).toHaveBeenCalledTimes(
        responseMock.length
      )
    })

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .get(`/target-property/${targetId}`)
        .send()
        .expect(403)
    })
  })

  describe('deleteTargetProperty', () => {
    it('should throw BadRequestException if id is missing', async () => {
      await expect(controller.deleteTargetProperty(undefined)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should throw NotFoundExceptions if no Target found for the id', async () => {
      mockTargetPropertyService.getOneTargetById.mockResolvedValue(false)

      await expect(controller.deleteTargetProperty('abc')).rejects.toThrow(
        NotFoundException
      )
    })

    it('should NOT remove target from hunt if delete success', async () => {
      mockTargetPropertyService.getOneTargetById.mockResolvedValue({
        huntId: 'h123'
      })
      mockTargetPropertyService.deleteTargetProperty.mockResolvedValue(false)

      await controller.deleteTargetProperty('abc')
      expect(mockHuntService.removeTargetFromHunt).not.toHaveBeenCalled()
    })

    it('should remove target from hunt if delete success', async () => {
      mockTargetPropertyService.getOneTargetById.mockResolvedValue({
        huntId: 'h123'
      })
      mockTargetPropertyService.deleteTargetProperty.mockResolvedValue(true)

      await controller.deleteTargetProperty('abc')
      expect(mockHuntService.removeTargetFromHunt).toHaveBeenCalled()
    })

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .delete(`/target-property/${targetId}`)
        .send()
        .expect(403)
    })
  })
})
