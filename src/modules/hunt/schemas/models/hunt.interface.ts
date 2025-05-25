interface HuntUser {
  id: string
  name: string
}
export interface InterfaceHunt {
  id?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
  creatorId: string
  title?: string
  type: 'buy' | 'rent' | 'either'
  movingExpected?: string
  livingPeople?: number
  livingPets?: number
  minBudget?: number
  maxBudget?: number
  targets?: string[]
  huntUsers?: HuntUser[]
}

export type CreateHuntServiceDate = Omit<
  InterfaceHunt,
  'createdAt' | 'updatedAt' | 'isActive'
>
