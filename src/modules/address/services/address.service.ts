import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreatedAddressFromTarget,
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

  // para ser usado no endpoint
  async extCreateAddress(
    address: InterfaceAddress,
  ): Promise<InterfaceProperty> {
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
      noLotNumber: address.noLotNumber,
    });

    if (!foundLots || foundLots.list.length <= 0) {
      const lot = await this.lotRepository.createLot({
        street: address.street,
        city: address.city,
        uf: address.uf,
        country: address.country,
        noLotNumber: address.noLotNumber,
        lotNumber: address.lotNumber,
        neighborhood: address.neighborhood,
        lotName: address.lotName ?? '',
        postalCode: address.postalCode ?? '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      noComplement: address.noComplement,
      propertyNumber: address.noComplement ? '0' : address.propertyNumber,
      block: address.noComplement ? '0' : (address.block ?? null),
      size: address.size ?? null,
      rooms: address.rooms ?? null,
      bathrooms: address.bathrooms ?? null,
      is_front: address.is_front ?? null,
      sun: address.sun ?? null,
      parking: address.parking ?? null,
      condoPricing: address.condoPricing ?? null,
      propertyConvenience: address.propertyConvenience ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return property;
  }

  // para ser utilizado integrado ao service de target
  async createAddress(
    address: InterfaceAddress,
  ): Promise<CreatedAddressFromTarget | null> {
    if (
      !address.street ||
      (!address.noLotNumber && !address.lotNumber) ||
      !address.city ||
      !address.country
    ) {
      console.log('Sem dados mínimos');
      return null;
    }

    let relatedLot: InterfaceLot | null = null;
    const foundLots = await this.lotRepository.getAllLotsByAddress({
      street: address.street,
      city: address.city,
      uf: address.uf,
      country: address.country,
      lotNumber: address.lotNumber,
      noLotNumber: address.noLotNumber,
    });

    console.log('foundLots', foundLots);

    if (!foundLots || foundLots.list.length <= 0) {
      console.log('vamos precisar criar o lot');
      const lot = await this.lotRepository.createLot({
        street: address.street,
        city: address.city,
        uf: address.uf,
        country: address.country,
        noLotNumber: address.noLotNumber,
        lotNumber: address.noLotNumber ? '0' : address.lotNumber,
        neighborhood: address.neighborhood,
        lotName: address.lotName ?? '',
        postalCode: address.postalCode ?? '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (!lot) {
        console.log('SEM LOT');
        return null;
      }

      relatedLot = lot;
    } else if (foundLots && foundLots.list.length >= 2) {
      console.log('lote duplicado');
    } else {
      relatedLot = foundLots[0].id;
    }

    console.log('lotId', relatedLot);
    if (!relatedLot.id) {
      console.log('SEM LOT ID');
      return null;
    }

    // se tem complemento mas nao tem propertyNumber ou block
    if (!address.noComplement && !address.propertyNumber && !address.block) {
      console.log('NO COMPLEMENT DATA');
      return { lot: relatedLot };
    }

    const foundProperties =
      await this.propertyRepository.getAllPropertiesByLotId(relatedLot.id);

    if (foundProperties && foundProperties.list.length >= 1) {
      const foundProperty = foundProperties.list.find(
        (prop) => prop.propertyNumber === address.propertyNumber,
      );

      if (foundProperty) {
        return { lot: relatedLot, property: foundProperty };
      }
    }

    const property = await this.propertyRepository.createProperty({
      lotId: relatedLot.id,
      noComplement: address.noComplement,
      propertyNumber: address.noComplement ? '0' : address.propertyNumber,
      block: address.noComplement ? '0' : (address.block ?? null),
      size: address.size ?? null,
      rooms: address.rooms ?? null,
      bathrooms: address.bathrooms ?? null,
      is_front: address.is_front ?? null,
      sun: address.sun ?? null,
      parking: address.parking ?? null,
      condoPricing: address.condoPricing ?? null,
      propertyConvenience: address.propertyConvenience ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { lot: relatedLot, property };
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
      noLotNumber: address.noLotNumber,
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
