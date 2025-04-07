import { BadRequestException, Injectable } from '@nestjs/common';
import {
  InterfaceAddress,
  InterfaceSearchAddress,
} from '../schemas/models/address.interface';
import { LotRepository } from '../repositories/lot.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { InterfaceProperty } from '../schemas/models/property.interface';
import { InterfaceLot } from '../schemas/models/lot.interface';
import { PaginatedData } from 'src/shared/types/response';

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
      !address.country
    ) {
      throw new BadRequestException(
        'Um endereço precisa ter no mínimo rua, número, cidade, estado e país.',
      );
    }

    let lotId: string | null = null;
    const foundLots = await this.lotRepository.getAllLotsByAddress({
      street: address.street,
      city: address.city,
      uf: address.uf,
      country: address.country,
      lotNumber: address.lotNumber,
    });

    if (!foundLots || foundLots.list.length <= 0) {
      const lot = await this.lotRepository.createLot({
        street: address.street,
        city: address.city,
        uf: address.uf,
        country: address.country,
        lotNumber: address.lotNumber,
        neighborhood: address.neighborhood,
        lotName: address.lotName ?? '',
        postalCode: address.postalCode ?? '',
      });

      if (!lot) {
        throw new BadRequestException(
          'Não foi possível criar esse endereço no momento',
        );
      }

      lotId = lot.id;
    } else if (foundLots && foundLots.list.length >= 2) {
      throw new BadRequestException(
        'Não foi possível criar esse endereço no momento, lote duplicado.',
      );
    } else {
      lotId = foundLots[0].id;
    }

    if (!lotId) {
      throw new BadRequestException(
        'Não foi possível criar esse endereço no momento.',
      );
    }

    if (!address.propertyNumber) {
      throw new BadRequestException(
        'Sem complemento não é possível completar o endereço, use 0 para endereços sem complemento',
      );
    }

    const foundProperties =
      await this.propertyRepository.getAllPropertiesByLotId(lotId);

    if (foundProperties && foundProperties.list.length >= 1) {
      const foundProperty = foundProperties.list.find(
        (prop) => prop.propertyNumber === address.propertyNumber,
      );

      if (foundProperty) {
        return foundProperty;
      }
    }

    const property = this.propertyRepository.createProperty({
      lotId: lotId,
      propertyNumber: address.propertyNumber,
      block: address.block ?? null,
      size: address.size ?? null,
      rooms: address.rooms ?? null,
      bathrooms: address.bathrooms ?? null,
      is_front: address.is_front ?? null,
      sun: address.sun ?? null,
      parking: address.parking ?? null,
      condoPricing: address.condoPricing ?? null,
      propertyConvenience: address.propertyConvenience ?? null,
    });

    return property;
  }

  async findByAddress(
    address: InterfaceSearchAddress,
  ): Promise<{ lot?: InterfaceLot[]; property?: InterfaceProperty[] }> {
    if (
      !address.street ||
      !address.lotNumber ||
      !address.city ||
      !address.country
    ) {
      throw new BadRequestException(
        'Um endereço precisa ter no mínimo rua, número, cidade, estado e país.',
      );
    }

    const foundLots = await this.lotRepository.getAllLotsByAddress({
      street: address.street,
      city: address.city,
      uf: address.uf,
      country: address.country,
      lotNumber: address.lotNumber,
    });

    if (!foundLots || foundLots.list.length <= 0) {
      return { lot: [], property: [] };
    }

    let properties: InterfaceProperty[] = [];
    if (foundLots.list.length === 1) {
      const foundProperties =
        await this.propertyRepository.getAllPropertiesByLotId(foundLots[0].id);

      if (address.propertyNumber) {
        const property = foundProperties.list.find(
          (property) => property.propertyNumber === address.propertyNumber,
        );

        properties = [property];
      } else {
        properties = foundProperties.list;
      }
    }

    return { lot: foundLots.list ?? [], property: properties };
  }

  async findLotsByAddress(
    address: InterfaceSearchAddress,
  ): Promise<PaginatedData<InterfaceLot>> {
    if (!address.street || !address.city || !address.country) {
      throw new BadRequestException(
        'Um endereço precisa ter no mínimo rua, número, cidade, estado e país.',
      );
    }

    const foundLots = await this.lotRepository.getAllLotsByAddress({
      street: address.street,
      city: address.city,
      country: address.country,
      uf: address.uf,
    });

    return foundLots;
  }
}
