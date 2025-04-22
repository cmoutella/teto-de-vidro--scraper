import { APP_GUARD } from '@nestjs/core'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AddressService } from '@src/modules/address/services/address.service'
import { HuntRepository } from '@src/modules/hunt/repositories/hunt.repository'
import { MockAuthGuard } from 'test/mocks/mock-auth.guard'

import { TargetPropertyRepository } from '../../repositories/target-property.repository'
import { TargetPropertyService } from '../../services/target-property.service'

describe('TargetPropertyService | UnitTest', () => {
  let service: TargetPropertyService

  const mockTargetPropertyRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  const mockHuntRepository = {
    findById: jest.fn()
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

  // Exemplo de teste real:
  // it('should call create on the repository', async () => {
  //   const dto = { name: 'Test' };
  //   mockTargetPropertyRepository.create.mockResolvedValue({ ...dto, _id: '123' });

  //   const result = await service.create(dto as any);
  //   expect(mockTargetPropertyRepository.create).toHaveBeenCalledWith(dto);
  //   expect(result).toEqual({ ...dto, _id: '123' });
  // });
})
