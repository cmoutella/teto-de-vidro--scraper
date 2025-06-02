import { NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { LeanDoc } from '@src/shared/types/mongoose'
import { Model } from 'mongoose'

import { Invitation } from '../../schema/invitation.schema'
import { InvitationInterface } from '../../schema/model/invitation.interface'
import { InvitationRepository } from '../invitation.repository'

export class InvitationMongooseRepository implements InvitationRepository {
  constructor(
    @InjectModel(Invitation.name) private invitationModel: Model<Invitation>
  ) {}

  async addInvitation(
    userId: string,
    invitedUserId?: string
  ): Promise<InvitationInterface> {
    const now = new Date().toISOString()
    const newInvitation = new this.invitationModel({
      userId,
      invitedUserId,
      status: 'invited',
      createdAt: now,
      updatedAt: now
    })

    await newInvitation.save()

    const created = await this.invitationModel
      .findById(newInvitation._id)
      .lean<LeanDoc<InvitationInterface>>()
      .exec()

    const { _id, __v, ...data } = created

    return { id: _id, ...data } as InvitationInterface
  }

  async listUserAcceptedInvitations(
    userId: string
  ): Promise<InvitationInterface[]> {
    const acceptedInvites = await this.invitationModel
      .find({
        userId: userId,
        status: 'accepted'
      })
      .exec()

    return acceptedInvites as InvitationInterface[]
  }

  async updateInvitation(
    invitedUserId: string,
    data: Partial<InvitationInterface>
  ): Promise<void> {
    const invitation = await this.invitationModel
      .find({
        invitedUserId: invitedUserId
      })
      .exec()

    if (!invitation || invitation.length <= 0) {
      throw new NotFoundException('Convite não encontrado')
    }

    await this.invitationModel
      .updateOne(
        { _id: invitation[0].id },
        { status: data.status, updatedAt: new Date().toISOString() }
      )
      .exec()
  }

  async deleteInvitation(id: string): Promise<void> {
    await this.invitationModel.deleteOne({ _id: id }).exec()
  }
}
