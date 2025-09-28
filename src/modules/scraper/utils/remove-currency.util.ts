export function removeBrl(val: string): number {
  if (!val || typeof val !== 'string') {
    return 0
  }

  // Remove tudo exceto números, pontos e vírgulas
  const cleaned = val
    .replace(/[^\d.,]/g, '') // Mantém apenas dígitos, pontos e vírgulas
    .replace(/\./g, '') // Remove pontos (separadores de milhares)
    .replace(',', '.') // Converte vírgula decimal para ponto

  const result = parseFloat(cleaned)
  return isNaN(result) ? 0 : result
}
