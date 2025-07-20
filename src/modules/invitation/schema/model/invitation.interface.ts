export interface InvitationInterface {
  userId: string
  invitedUserId: string
  status: 'invited' | 'accepted' | 'declined'

  createdAt: string
  updatedAt: string
}
