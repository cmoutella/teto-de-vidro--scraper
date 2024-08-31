import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRepository } from '../../repositories/property.repository';
import { PropertyMongooseRepository } from '../../repositories/mongoose/property.mongoose.repository';
import { PropertyService } from '../../services/property-collection.service';
import { AddressController } from '../address-collection.controller';
import { LotRepository } from '../../repositories/lot.repository';
import { LotMongooseRepository } from '../../repositories/mongoose/lot.mongoose.repository';
import { LotService } from '../../services/lot-collection.service';
import { AddressService } from '../../services/address.service';
import { mockCreateAddress101 } from './__mock__';

describe('Address Controller', () => {
  let controller: AddressController;
  const lotsIds: string[] = [];
  const propertiesIds: string[] = [];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: PropertyRepository,
          useClass: PropertyMongooseRepository,
        },
        {
          provide: LotRepository,
          useClass: LotMongooseRepository,
        },
        PropertyService,
        LotService,
        AddressService,
      ],
    }).compile();

    controller = app.get<AddressController>(AddressController);
  });

  describe('createAddress', async () => {
    const createdAddress1 =
      await controller.createAddress(mockCreateAddress101);

    it('should return a property', () => {
      expect(createdAddress1).toBeTruthy();
    });

    it('should create or find property', () => {
      const returnedObjectKeys = Object(createdAddress1).keys();

      lotsIds.push(createdAddress1.mainAddressId);
      propertiesIds.push(createdAddress1.id);

      expect(returnedObjectKeys).toContain('mainAddressId');
    });
  });

  describe('searchByAddress', () => {
    // TODO
  });

  describe('getLotsByAddress', () => {
    it('should find lots for the address details received', async () => {
      const found = await controller.getLotsByAddress({
        street: mockCreateAddress101.street,
        province: mockCreateAddress101.province,
        city: mockCreateAddress101.city,
        country: mockCreateAddress101.country,
        neighborhood: mockCreateAddress101.neighborhood,
      });

      console.log(found);

      found.forEach((lot) => lotsIds.push(lot.id ?? ''));

      expect(found.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe.skip('getPropertiesByMainAddressId', () => {
    // TODO
  });

  describe.skip('deleteLot', () => {
    // TODO
  });

  describe.skip('deleteProperty', () => {
    // TODO
  });
});
