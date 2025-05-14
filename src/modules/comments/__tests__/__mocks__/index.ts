export const mockCommentRepository = {
  createComment: jest.fn(),
  getOneCommentById: jest.fn(),
  getCommentsByTarget: jest.fn(),
  getCommentsByTargetAndTopic: jest.fn(),
  getCommentsByLot: jest.fn(),
  getCommentsByProperty: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn()
}
