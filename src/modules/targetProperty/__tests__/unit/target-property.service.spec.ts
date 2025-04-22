import { BadRequestException } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AddressService } from '@src/modules/address/services/address.service'
import { HuntRepository } from '@src/modules/hunt/repositories/hunt.repository'
import { MockAuthGuard } from 'test/mocks/mock-auth.guard'

import { TargetPropertyRepository } from '../../repositories/target-property.repository'
import type { InterfaceTargetProperty } from '../../schemas/models/target-property.interface'
import { TargetPropertyService } from '../../services/target-property.service'

const baseProperty: InterfaceTargetProperty = {
  adURL: '',
  sellPrice: 0,
  rentPrice: 0,
  condoPricing: 0,
  iptu: 0,
  huntId: 'hunt123',
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

describe('TargetPropertyService | UnitTest', () => {
  let service: TargetPropertyService

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
    addTargetToHunt: jest.fn(),
    removeTargetFromHunt: jest.fn()
  }

  const mockAddressService = {
    validateZipCode: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TargetPropertyService,
        {
          provide: TargetPropertyRepository,
          useValue: mockTargetPropertyRepository
        },
        {
          provide: HuntRepository,
          useValue: mockHuntRepository
        },
        {
          provide: AddressService,
          useValue: mockAddressService
        },
        {
          provide: APP_GUARD,
          useClass: MockAuthGuard
        }
      ]
    }).compile()

    service = module.get<TargetPropertyService>(TargetPropertyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createTargetProperty', () => {
    it('should throw BadRequestException if huntId is missing', async () => {
      await expect(
        service.createTargetProperty({
          ...baseProperty,
          huntId: undefined
        } as InterfaceTargetProperty)
      ).rejects.toThrow(BadRequestException)
    })

    it.skip('should throw ConflictException ALREADY_EXISTS if target already exists in hunt', async () => {
      // targetRepository.getHuntTargetByFullAddress.mockResolvedValueOnce({})
      // await expect(service.createTargetProperty(baseProperty)).rejects.toThrow(
      //   ConflictException
      // )
    })

    it.skip('should throw ConflictException DUPLICITY_WARNING if target with similar address already exists in hunt', async () => {
      // targetRepository.getHuntTargetByFullAddress.mockResolvedValueOnce({})
      // await expect(service.createTargetProperty(baseProperty)).rejects.toThrow(
      //   ConflictException
      // )
    })

    it.skip('should call address service to register and get address ids', () => {})
  })

  describe('getAllTargetsByHunt', () => {
    it('should throw BadRequestException if huntId is missing', async () => {
      await expect(
        service.getAllTargetsByHunt(undefined, 1, 10)
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('getOneTargetById', () => {
    it('should throw BadRequestException if id is missing', async () => {
      await expect(service.getOneTargetById(undefined)).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe('updateTargetProperty', () => {
    it('should throw BadRequestException if id is missing', async () => {
      await expect(service.updateTargetProperty(undefined, {})).rejects.toThrow(
        BadRequestException
      )
    })

    it.skip('should verify if there is already a target with the final updated data before updating', () => {
      // verifica se os métodos getHuntTargetByFullAddress, getHuntTargetsByLot e getHuntTargetsByStreet do targetPropertyRepository estão sendo chamados
    })

    it.skip('should run createAddress on target address update', () => {
      // verificar se o método createAddress do addressService está sendo chamado
    })
  })

  describe('deleteTargetProperty', () => {
    it('should throw BadRequestException if id is missing', async () => {
      await expect(service.updateTargetProperty(undefined, {})).rejects.toThrow(
        BadRequestException
      )
    })

    it.skip('should remove target Id from hunt targets', () => {
      // verificar se removeTargetFromHunt do huntRepository está sendo chamado
    })

    it.skip('should delete target instance', () => {
      // verificar se deleteTargetProperty do targetPropertyRepository está sendo chamado
    })
  })
})
