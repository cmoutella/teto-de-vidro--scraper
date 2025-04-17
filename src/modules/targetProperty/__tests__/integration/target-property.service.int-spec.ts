import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { TargetPropertyRepository } from '../../repositories/target-property.repository';
import {
  TargetProperty,
  TargetPropertySchema,
} from '../../schemas/target-property.schema';

import { HuntRepository } from 'src/modules/hunt/repositories/hunt.repository';
import { Hunt, HuntSchema } from 'src/modules/hunt/schemas/hunt.schema';

import { AddressService } from 'src/modules/address/services/address.service';
import { TargetPropertyService } from '../../services/target-property.service';
import { HuntService } from '@src/modules/hunt/services/hunt-collection.service';
import { TargetPropertyMongooseRepository } from '../../repositories/mongoose/target-property.mongoose.repository';
import { HuntMongooseRepository } from '@src/modules/hunt/repositories/mongoose/hunt.mongoose.repository';

describe('TargetPropertyService | Integration Test', () => {
  let service: TargetPropertyService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: TargetProperty.name, schema: TargetPropertySchema },
          { name: Hunt.name, schema: HuntSchema },
        ]),
      ],
      providers: [
        TargetPropertyService,
        HuntService,
        {
          provide: TargetPropertyRepository,
          useClass: TargetPropertyMongooseRepository,
        },
        {
          provide: HuntRepository,
          useClass: HuntMongooseRepository,
        },
        {
          provide: AddressService,
          useValue: {
            validateZipCode: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<TargetPropertyService>(TargetPropertyService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should create a target property', async () => {
  //   const dto = { ... }; // dados de exemplo
  //   const result = await service.create(dto);
  //   expect(result).toBeDefined();
  // });
});
