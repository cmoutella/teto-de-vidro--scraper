export function extractAddress(address: string) {
  const addressRegex =
    /^(.*?)(?:,\s*(\d+))?\s*-\s*(.*?),\s*(.*?)\s*-\s*([A-Z]{2})$/

  const match = address.match(addressRegex)

  if (!match) {
    throw new Error('Endereço inválido ou fora do padrão esperado.')
  }

  const [, street, number, neighborhood, city, uf] = match

  return {
    street: street.trim(),
    lotNumber: number ? number.trim() : null,
    neighborhood: neighborhood.trim(),
    city: city.trim(),
    uf: uf.trim()
  }
}
