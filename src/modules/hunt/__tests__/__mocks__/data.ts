import { Types } from 'mongoose'

import type { InterfaceHunt } from '../../schemas/models/hunt.interface'

export const userId = 'user-123'

export const baseHunt: InterfaceHunt = {
  creatorId: userId,
  type: 'rent',
  title: 'Minha mudança',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const userObjectId = new Types.ObjectId().toHexString()
export const huntObjectId = new Types.ObjectId().toHexString()
export const mockTargets = ['target-1', 'target-2']
export const huntMock: InterfaceHunt = {
  creatorId: userObjectId,
  type: 'buy',
  title: 'Test Hunt',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
