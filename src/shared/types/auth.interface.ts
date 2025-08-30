export type UserRole =
  | 'beta'
  | 'guest'
  | 'regular'
  | 'tester'
  | 'admin'
  | 'master'

export interface AuthenticatedUser {
  id: string
  email: string
  accessLevel: number
  role: UserRole
}
