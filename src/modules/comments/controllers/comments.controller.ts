import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { LotService } from '@src/modules/address/services/lot-collection.service'
import { PropertyService } from '@src/modules/address/services/property-collection.service'
import { UserService } from '@src/modules/user/services/user.service'
import { differenceInMinutes } from 'date-fns'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor'
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe'
import { z } from 'zod'

import { Comment } from '../schemas/comment.schema'
import {
  CommentTopic,
  InterfaceComment
} from '../schemas/models/comment.interface'
import {
  CreateCommentData,
  createCommentSchema
} from '../schemas/zod-validation/create'
import { updateCommentSchema } from '../schemas/zod-validation/update'
import { CommentService } from '../services/comments.service'

type CreateComment = z.infer<typeof createCommentSchema>
type UpdateComment = z.infer<typeof updateCommentSchema>

@ApiTags('comments')
@UseInterceptors(LoggingInterceptor)
@Controller('comment')
export class CommentsController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly lotService: LotService,
    private readonly propertyService: PropertyService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createCommentSchema))
  @ApiOperation({ summary: 'Cria um comentário' })
  @ApiBody({
    type: Comment,
    description: 'Payload da criação de um comentário'
  })
  // TODO:
  // @ApiResponse({
  //   type: CreateUserSuccess,
  //   status: 201,
  //   description: 'Usuário criado com sucesso'
  // })
  // @ApiResponse({
  //   type: CreateUserFailureException,
  //   status: 409,
  //   description: 'Nome de usuário já existe'
  // })
  @Post()
  async createComment(
    @Body()
    {
      comment,
      author,
      authorPrivacy,
      relationship,
      target,
      topic,
      validation
    }: CreateComment
  ) {
    const validUser = await this.userService.getById(author)

    if (!validUser) {
      throw new NotFoundException('Usuário não encontrado')
    }

    if (relationship) {
      if (relationship.relativeTo === 'lot') {
        const validLot = await this.lotService.getOneLot(
          relationship.relativeId
        )

        if (!validLot) {
          throw new NotFoundException('Relative lot invalid')
        }
      } else if (relationship.relativeTo === 'property') {
        const validProperty = await this.propertyService.getOneProperty(
          relationship.relativeId
        )

        if (!validProperty) {
          throw new NotFoundException('Relative property invalid')
        }
      }
    }

    return await this.commentService.createComment({
      comment,
      author,
      authorPrivacy,
      relationship,
      target,
      topic,
      validation
    } as CreateCommentData)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Atualiza um comentário' })
  @ApiBody({
    type: Comment,
    description: 'Payload da atualização de um comentário'
  })
  // TODO:
  // @ApiResponse({
  //   type: CreateUserSuccess,
  //   status: 201,
  //   description: 'Usuário criado com sucesso'
  // })
  // @ApiResponse({
  //   type: CreateUserFailureException,
  //   status: 409,
  //   description: 'Nome de usuário já existe'
  // })
  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCommentSchema))
    body: UpdateComment
  ) {
    console.log('hello', body)

    const found = await this.commentService.getOneCommentById(id)

    if (!found) {
      throw new NotFoundException()
    }

    const creationAgo = differenceInMinutes(
      new Date(),
      new Date(found.createdAt)
    )
    if (creationAgo > 15) {
      throw new BadRequestException('Tempo de alteração expirado')
    }

    return await this.commentService.updateComment(
      id,
      body as Partial<InterfaceComment>
    )
  }

  @ApiOperation({ summary: 'Busca comentário por id' })
  // TODO:
  // @ApiResponse({
  //   type: GetOneCommentSuccess,
  //   status: 200,
  //   description: 'Comentário encontrado com sucesso'
  // })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.commentService.getOneCommentById(id)
  }

  @ApiOperation({ summary: 'Busca comentários por target' })
  // TODO:
  // @ApiResponse({
  //   type: GetManyCommentsSuccess,
  //   status: 200,
  //   description: 'Comentários encontrados com sucesso'
  // })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/target/:targetId')
  async getByTarget(
    @Param('targetId') targetId: string,
    @Query('topic') topic?: CommentTopic,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const response = topic
      ? await this.commentService.getCommentsByTargetAndTopic(
          targetId,
          topic,
          page,
          limit
        )
      : await this.commentService.getCommentsByTarget(targetId, page, limit)

    return response
  }

  @ApiOperation({ summary: 'Busca comentários por target' })
  // TODO:
  // @ApiResponse({
  //   type: GetManyCommentsSuccess,
  //   status: 200,
  //   description: 'Comentários encontrados com sucesso'
  // })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/lot/:lotId')
  async getByLot(
    @Param('lotId') lotId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return await this.commentService.getCommentsByLot(lotId, page, limit)
  }

  @ApiOperation({ summary: 'Busca comentários por target' })
  // TODO:
  // @ApiResponse({
  //   type: GetManyCommentsSuccess,
  //   status: 200,
  //   description: 'Comentários encontrados com sucesso'
  // })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/property/:propertyId')
  async getByProperty(
    @Param('propertyId') propertyId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return await this.commentService.getCommentsByProperty(
      propertyId,
      page,
      limit
    )
  }

  @ApiOperation({ summary: 'Deleta um comentário por id' })
  // TODO:
  // @ApiResponse({
  //   type: DeleteUserSuccess,
  //   status: 200,
  //   description: 'Comentário deletado com sucesso'
  // })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.commentService.deleteComment(id)
  }
}
