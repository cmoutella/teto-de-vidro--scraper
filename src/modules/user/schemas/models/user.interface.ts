export interface InterfaceUser {
  id?: string

  // identify user
  name: string
  familyName?: string
  cpf?: string
  email: string

  // access
  accessLevel: number
  status: 'beta' | 'guest' | 'regular' | 'tester' | 'admin' | 'master'

  // user profiling
  profession?: string
  gender?: 'male' | 'female' | 'neutral'
  birthDate?: string

  // user settings
  password?: string

  // history
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

// returned on public routes
export type PublicInterfaceUser = Omit<InterfaceUser, 'password'>
