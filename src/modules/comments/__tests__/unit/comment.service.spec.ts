import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { mockCommentRepository } from '../__mocks__'
import { mockCreateComment } from '../__mocks__/data'
import { CommentRepository } from '../../repositories/comment.repository'
import { CommentService } from '../../services/comments.service'

describe('CommentService | UnitTest', () => {
  let service: CommentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: mockCommentRepository
        }
      ]
    }).compile()

    jest.clearAllMocks()

    service = module.get<CommentService>(CommentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createComment', () => {
    it('should call repository to create a new target property', async () => {
      mockCommentRepository.createComment.mockResolvedValue({
        ...mockCreateComment,
        id: 'comment-123',
        createdAt: 'date-1',
        updatedAt: 'date-1'
      })

      await service.createComment(mockCreateComment)

      expect(mockCommentRepository.createComment).toHaveBeenCalledWith(
        mockCreateComment
      )
    })
  })

  describe('getOneCommentById', () => {
    it('should return falsy if id is missing', async () => {
      const found = await service.getOneCommentById(undefined)

      expect(found).toBeFalsy()
    })

    it('should call repository getOneCommentById', async () => {
      mockCommentRepository.getOneCommentById.mockReturnValue(mockCreateComment)
      await service.getOneCommentById('abc')

      expect(mockCommentRepository.getOneCommentById).toHaveBeenCalledWith(
        'abc'
      )
    })
  })

  describe('getCommentsByTarget', () => {
    // TODO getCommentsByTarget
  })

  describe('getCommentsByTargetAndTopic', () => {
    // TODO getCommentsByTargetAndTopic
  })

  describe('getCommentsByLot', () => {
    // TODO: getCommentsByLot
  })

  describe('getCommentsByProperty', () => {
    // TODO: getCommentsByProperty
  })

  describe('updateComment', () => {
    it('should return falsy if id is missing', async () => {
      const found = await service.updateComment(undefined, {
        ...mockCreateComment
      })

      expect(found).toBeFalsy()
    })

    it('should call repository to update the target property', async () => {
      mockCommentRepository.updateComment.mockResolvedValue({
        ...mockCreateComment,
        label: 'Teste'
      })

      await service.updateComment('abc', mockCreateComment)

      expect(mockCommentRepository.updateComment).toHaveBeenCalledWith(
        'abc',
        expect.objectContaining({
          ...mockCreateComment
        })
      )
    })
  })

  describe('deleteComment', () => {
    it('should return falsy if id is missing', async () => {
      const deleted = await service.deleteComment(undefined)

      expect(deleted).toBeFalsy()
    })

    it('should return true if deleted success', async () => {
      const deleted = await service.deleteComment('abc')

      expect(deleted).toBeTruthy()
    })
  })
})
