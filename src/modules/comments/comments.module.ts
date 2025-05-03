import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CommentsController } from './controllers/comments.controller'
import { CommentRepository } from './repositories/comment.repository'
import { CommentMongooseRepository } from './repositories/mongoose/comment.mongoose.repository'
import { Comment, CommentSchema } from './schemas/comment.schema'
import { CommentService } from './services/comments.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
  ],
  providers: [
    {
      provide: CommentRepository,
      useClass: CommentMongooseRepository
    },
    CommentService
  ],
  controllers: [CommentsController],
  exports: [CommentService]
})
export class CommentsCollectionModule {}
