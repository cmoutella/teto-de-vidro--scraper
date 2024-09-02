import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRepository } from '../../repositories/property.repository';
import { PropertyService } from '../../services/property-collection.service';
import { AddressController } from '../address-collection.controller';
import { LotRepository } from '../../repositories/lot.repository';
import { LotService } from '../../services/lot-collection.service';
import { AddressService } from '../../services/address.service';
import { mockCreateAddress101, mockLot, mockProperty } from './__mock__';

describe('Address Controller', () => {
  let app: TestingModule;
  let controller: AddressController;
  let addressService: AddressService;
  let propertyService: PropertyService;
  let lotService: LotService;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: PropertyRepository,
          useValue: {
            getAllPropertiesByMainAddress: jest
              .fn()
              .mockResolvedValue([mockProperty]),
            createProperty: jest.fn().mockResolvedValue(mockProperty),
            getOnePropertyById: jest.fn().mockResolvedValue(mockProperty),
            updateProperty: jest.fn().mockResolvedValue(mockProperty),
            deleteProperty: jest.fn().mockImplementation(),
          },
        },
        {
          provide: LotRepository,
          useValue: {
            getAllLotsByAddress: jest.fn().mockResolvedValue([mockLot]),
            createLot: jest.fn().mockResolvedValue(mockLot),
            getOneLot: jest.fn().mockResolvedValue(mockLot),
            updateLot: jest.fn().mockResolvedValue(mockLot),
            deleteLot: jest.fn().mockImplementation(),
          },
        },
        PropertyService,
        LotService,
        AddressService,
      ],
    }).compile();

    controller = app.get<AddressController>(AddressController);

    addressService = await app.get<AddressService>(AddressService);
    propertyService = await app.get<PropertyService>(PropertyService);
    lotService = await app.get<LotService>(LotService);
  });

  it('[createAddress] should call address service', async () => {
    const spyOnAddressService = jest.spyOn(addressService, 'createAddress');
    await controller.createAddress(mockCreateAddress101);

    expect(spyOnAddressService).toHaveBeenCalled();
  });

  it('[createAddress] should return a created or found property', async () => {
    const createdAddress1 =
      await controller.createAddress(mockCreateAddress101);

    expect(createdAddress1.propertyNumber).toBe(
      mockCreateAddress101.propertyNumber,
    );
  });

  it.skip('[searchByAddress] should call address service', () => {
    // TODO
  });

  it.skip('[searchByAddress] should return a list of lots and a list of properties', () => {
    // TODO
  });

  it('[findLotsByAddress] should call lots service', async () => {
    const spyOnLotsService = jest.spyOn(lotService, 'getAllLotsByAddress');
    await controller.findLotsByAddress({
      country: mockLot.country,
      city: mockLot.city,
      neighborhood: mockLot.neighborhood,
      province: mockLot.province,
      street: mockLot.street,
    });

    expect(spyOnLotsService).toHaveBeenCalled();
  });

  it('[findLotsByAddress] should return a list of lots for the given address', async () => {
    const foundLots = await controller.findLotsByAddress({
      country: mockLot.country,
      city: mockLot.city,
      neighborhood: mockLot.neighborhood,
      province: mockLot.province,
      street: mockLot.street,
    });

    expect(foundLots.length).toBeGreaterThanOrEqual(1);
  });

  it('[getPropertiesByMainAddressId] should call property service', async () => {
    const spyOnPropertyService = jest.spyOn(
      propertyService,
      'getAllPropertiesByMainAddress',
    );
    await controller.getPropertiesByMainAddress(mockProperty.mainAddressId);

    expect(spyOnPropertyService).toHaveBeenCalled();
  });

  it('[getPropertiesByMainAddressId] should return a list of properties for the given main address Id', async () => {
    const foundProperties = await controller.getPropertiesByMainAddress(
      mockProperty.mainAddressId,
    );

    expect(foundProperties.length).toBeGreaterThanOrEqual(1);
  });
});
