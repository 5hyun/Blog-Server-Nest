/** src/modules/posts/posts.controller.ts */
import {
    Controller,
    Post as HttpPost, // Post 메서드와 이름 충돌 방지를 위해 별칭 사용
    Get,
    Body,
    HttpCode,
    HttpStatus,
    Param,
    NotFoundException,
    Patch,
    Delete
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './posts.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('posts') // 이 컨트롤러의 API들을 'posts' 태그로 그룹화합니다.
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @ApiOperation({ summary: '새 게시물 생성', description: '새로운 블로그 게시물을 생성합니다.' })
    @ApiResponse({ status: 201, description: '게시물이 성공적으로 생성되었습니다.', type: PostEntity })
    @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
    @HttpPost()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createPostDto: CreatePostDto,
    ): Promise<PostEntity> {
        return this.postsService.createPost(createPostDto);
    }

    @ApiOperation({ summary: '모든 게시물 조회', description: '모든 블로그 게시물 목록을 조회합니다.' })
    @ApiResponse({ status: 200, description: '성공적으로 조회되었습니다.', type: [PostEntity] })
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<PostEntity[]> {
        return this.postsService.findAllPosts();
    }

    @ApiOperation({ summary: '특정 게시물 상세 조회', description: 'ID로 특정 게시물을 상세 조회하고 조회수를 1 증가시킵니다.' })
    @ApiParam({ name: 'id', description: '조회할 게시물의 ID', type: Number })
    @ApiResponse({ status: 200, description: '성공적으로 조회되었습니다.', type: PostEntity })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없습니다.' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException(`ID가 ${id}인 게시물을 찾을 수 없습니다.`);
        }
        return post;
    }

    @ApiOperation({ summary: '게시물 수정', description: 'ID로 특정 게시물을 수정합니다.' })
    @ApiParam({ name: 'id', description: '수정할 게시물의 ID', type: Number })
    @ApiResponse({ status: 200, description: '성공적으로 수정되었습니다.', type: PostEntity })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없습니다.' })
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostEntity> {
        return this.postsService.updatePost(id, updatePostDto);
    }

    @ApiOperation({ summary: '게시물 삭제', description: 'ID로 특정 게시물을 삭제합니다.' })
    @ApiParam({ name: 'id', description: '삭제할 게시물의 ID', type: Number })
    @ApiResponse({ status: 200, description: '성공적으로 삭제되었습니다.' })
    @ApiResponse({ status: 404, description: '게시물을 찾을 수 없습니다.' })
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        await this.postsService.deletePost(id);
        return { message: `ID가 ${id}인 게시물이 성공적으로 삭제되었습니다.` };
    }
}