export interface InterfaceUser {
  id?: string
  nickName: string
  name: string
  password: string
  profession?: string
  gender: 'male' | 'female' | 'neutral'
  birthDate: string
  email: string
}

// returned on public routes
export type PublicInterfaceUser = Omit<InterfaceUser, 'password'>
