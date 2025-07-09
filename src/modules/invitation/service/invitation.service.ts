import { Injectable } from '@nestjs/common'

import { InvitationRepository } from '../repositories/invitation.repository'

@Injectable()
export class InvitationService {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async addInvitation(userId: string, invitedUserId: string) {
    await this.invitationRepository.addInvitation(userId, invitedUserId)
  }

  async updateInvitation(invitedUserId, data) {
    await this.invitationRepository.updateInvitation(invitedUserId, data)
  }

  async countInvitationsSent(userId: string) {
    const invitations =
      await this.invitationRepository.listUserSentInvitations(userId)
    return invitations.length
  }

  async countInvitationsAccepted(userId: string) {
    return await this.invitationRepository.listUserAcceptedInvitations(userId)
  }
}
