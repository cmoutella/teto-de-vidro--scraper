export function removeBrl(val: string) {
  const onlyNum = val.replace('R$', '').trim()

  return Number(onlyNum.replaceAll('.', '').trim())
}
