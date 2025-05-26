import type { INestApplication } from '@nestjs/common'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { mockTargetPropertyService } from '@src/modules/targetProperty/__tests__/__mocks__'
import {
  TargetProperty,
  TargetPropertySchema
} from '@src/modules/targetProperty/schemas/target-property.schema'
import { TargetPropertyService } from '@src/modules/targetProperty/services/target-property.service'
import { mockUserService } from '@src/modules/user/__tests__/__mocks__'
import { mockedUser } from '@src/modules/user/__tests__/__mocks__/data'
import { UserService } from '@src/modules/user/services/user.service'
import { ResponseInterceptor } from '@src/shared/interceptors/response.interceptor'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { Hunt, HuntSchema } from 'src/modules/hunt/schemas/hunt.schema'
import { HuntService } from 'src/modules/hunt/services/hunt-collection.service'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import request from 'supertest'
import { MockAuthGuard } from 'test/mocks/mock-auth.guard'

import { mockHuntService } from '../__mocks__'
import { huntMock, huntObjectId, mockTargets } from '../__mocks__/data'
import { HuntController } from '../../controllers/hunt-collection.controller'
import type { InterfaceHunt } from '../../schemas/models/hunt.interface'

/**
 * TODO
 * - testar validação com zod
 */
describe.only('HuntController | Integration Test', () => {
  let controller: HuntController
  let mongod: MongoMemoryServer
  let app: INestApplication

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
        { provide: UserService, useValue: mockUserService }
      ]
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile()

    controller = module.get<HuntController>(HuntController)
    app = module.createNestApplication()
    app.useGlobalInterceptors(new ResponseInterceptor())
    await app.init()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
    await app.close()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createHunt', () => {
    it('should return created target if success', async () => {
      MockAuthGuard.allow = true

      mockUserService.getById.mockResolvedValue(true)
      mockHuntService.createHunt.mockResolvedValue({
        ...huntMock,
        id: 'target-123'
      })

      await request(app.getHttpServer())
        .post('/hunt')
        .set('Content-Type', 'application/json')
        .send(huntMock)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('status')
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('id')
        })
    })

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .post('/hunt')
        .send({
          ...huntMock
        })
        .expect(403)
    })
  })

  describe('getAllHuntsByUser', () => {
    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      mockUserService.getById.mockResolvedValue(mockedUser)

      await request(app.getHttpServer())
        .get(`/hunt/search/user`)
        .send()
        .expect(403)
    })
  })

  describe('getOneHuntById', () => {
    it('should throw BadRequestException if id is missing', async () => {
      MockAuthGuard.allow = true

      await expect(controller.getOneHuntById(undefined)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .get(`/hunt/${huntObjectId}`)
        .send()
        .expect(403)
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

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .put(`/hunt/${huntObjectId}`)
        .send({
          ...huntMock
        })
        .expect(403)
    })
  })

  describe('deleteHunt', () => {
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

    it('should require authorization in request headers', async () => {
      MockAuthGuard.allow = false

      await request(app.getHttpServer())
        .delete(`/hunt/${huntObjectId}`)
        .send()
        .expect(403)
    })
  })
})
