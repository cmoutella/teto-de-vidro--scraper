import { BadRequestException, Injectable } from '@nestjs/common';
import { InterfaceAddress } from '../schemas/models/address.interface';
import { LotRepository } from 'src/modules/lot/repositories/lot.repository';
import { PropertyRepository } from 'src/modules/property/repositories/property.repository';
import { InterfaceProperty } from 'src/modules/property/schemas/models/property.interface';

@Injectable()
export class AddressService {
  constructor(
    private readonly lotRepository: LotRepository,
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async createAddress(address: InterfaceAddress): Promise<InterfaceProperty> {
    if (
      !address.street ||
      !address.lotNumber ||
      !address.city ||
      !address.province ||
      !address.country
    ) {
      throw new BadRequestException(
        'Um endereço precisa ter no mínimo rua, número, cidade, estado e país.',
      );
    }

    if (!address.propertyNumber) {
      throw new BadRequestException(
        'Sem complemento não é possível completar o endereço, use 0 para endereços sem complemento',
      );
    }

    const foundLots = await this.lotRepository.getAllLotsByAddress({
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      number: address.lotNumber,
    });

    if (!foundLots || foundLots.length <= 0) {
      const lot = await this.lotRepository.createLot({
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        number: address.lotNumber,
        neighborhood: address.neighborhood,
        name: address.lotName ?? '',
        postalCode: address.postalCode ?? '',
      });

      if (!lot) {
        throw new BadRequestException(
          'Não foi possível criar esse endereço no momento',
        );
      }

      const property = this.propertyRepository.createProperty({
        mainAddressId: lot.id,
        number: address.propertyNumber,
        block: address.block ?? null,
        size: address.size ?? null,
        rooms: address.rooms ?? null,
        bathrooms: address.bathrooms ?? null,
        is_front: address.is_front ?? null,
        sun: address.sun ?? null,
        parking: address.parking ?? null,
        condoPricing: address.condoPricing ?? null,
        convenience: address.propertyConvenience ?? null,
      });

      return property;
    }

    if (foundLots && foundLots.length >= 2) {
      throw new BadRequestException(
        'Não foi possível criar esse endereço no momento',
      );
    }

    const lotId = foundLots[0].id;

    if (!lotId) {
      throw new BadRequestException(
        'Não foi possível criar esse endereço no momento',
      );
    }

    const foundProperties =
      await this.propertyRepository.getAllPropertiesByMainAddress(lotId);

    if (foundProperties && foundProperties.length >= 1) {
      const foundProperty = foundProperties.find(
        (prop) => prop.number === address.propertyNumber,
      );

      if (foundProperty) {
        return foundProperty;
      }
    }

    const property = this.propertyRepository.createProperty({
      mainAddressId: lotId,
      number: address.propertyNumber,
      block: address.block ?? null,
      size: address.size ?? null,
      rooms: address.rooms ?? null,
      bathrooms: address.bathrooms ?? null,
      is_front: address.is_front ?? null,
      sun: address.sun ?? null,
      parking: address.parking ?? null,
      condoPricing: address.condoPricing ?? null,
      convenience: address.propertyConvenience ?? null,
    });

    return property;
  }
}
