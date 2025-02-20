import { InterfaceLot } from 'src/modules/address/schemas/models/lot.interface';

export interface ValidatedAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
}

export interface ValidatedAddressTranslated {
  postalCode: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  city: string;
  uf: string;
}

export function CEPService() {
  const CEP_URL = process.env.OPENCEP_API;

  if (!CEP_URL) {
    throw new Error('CEP_URL secret not found');
  }

  function objectTranslate(data: ValidatedAddress) {
    return {
      postalCode: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      uf: data.uf,
    } as ValidatedAddressTranslated;
  }

  async function cepFetch(cep: string) {
    const cleanCEP = cep.replace(/\D/g, '').trim();

    const data = await fetch(`${CEP_URL}/${cleanCEP}`).then((res) =>
      res.json(),
    );

    if (!data) return null;

    return objectTranslate(data);
  }

  async function getAddress(cep: string) {
    const verifiedData = await cepFetch(cep);

    if (!verifiedData) {
      return null;
    }

    return verifiedData;
  }

  async function validateAddress(cep: string, address: InterfaceLot) {
    const verifiedData = await cepFetch(cep);

    if (!verifiedData) {
      return null;
    }

    const verifiedDataKeys: string[] = Object.keys(verifiedData);

    return verifiedDataKeys.every((key) => verifiedData[key] === address[key]);
  }

  return { get: getAddress, validate: validateAddress };
}
