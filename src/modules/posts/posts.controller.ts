/** src/modules/posts/posts.controller.ts */
import {
    Controller,
    Post as HttpPost, // Post 메서드와 이름 충돌 방지를 위해 별칭 사용
    Get,
    Body,
    HttpCode,
    HttpStatus,
    ValidationPipe,
    Param, // Param 데코레이터 임포트
    NotFoundException, // NotFoundException 임포트
    Patch,
    Delete
} from '@nestjs/common';
import { PostsService } from './posts.service'; // PostsService 임포트
import { CreatePostDto } from './dto/create-post.dto'; // CreatePostDto 임포트
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './posts.entity'; // Post 엔티티 임포트 (이름 충돌 방지 별칭)

@Controller('posts') // 기본 경로를 'posts'로 설정
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    /**
     * 새로운 블로그 게시물을 생성하는 API 엔드포인트입니다.
     * @param createPostDto 블로그 생성 데이터
     * @returns 생성된 블로그 게시물 객체
     */
    @HttpPost() // POST 메서드 사용
    @HttpCode(HttpStatus.CREATED) // 성공 시 201 Created 응답
    async create(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        createPostDto: CreatePostDto,
    ): Promise<PostEntity> {
        return this.postsService.createPost(createPostDto);
    }

    /**
     * 모든 블로그 게시물을 조회하는 API 엔드포인트입니다.
     * @returns 모든 블로그 게시물 목록
     */
    @Get()
    @HttpCode(HttpStatus.OK) // 성공 시 200 OK 응답
    async findAll(): Promise<PostEntity[]> {
        return this.postsService.findAllPosts();
    }

    /**
     * 특정 ID를 가진 블로그 게시물을 상세 조회하는 API 엔드포인트입니다.
     * 조회 시 조회수를 1 증가시킵니다.
     * @param id 조회할 게시물의 ID
     * @returns 조회된 블로그 게시물 객체
     */
    @Get(':id') // ID 파라미터를 받는 GET 요청
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException(`ID가 ${id}인 게시물을 찾을 수 없습니다.`);
        }
        return post;
    }

    /**
     * 특정 ID를 가진 블로그 게시물을 수정하는 API 엔드포인트입니다.
     * @param id 수정할 게시물의 ID
     * @param updatePostDto 게시물 업데이트 데이터
     * @returns 수정된 블로그 게시물 객체
     */
    @Patch(':id') // PATCH 메서드 사용 (부분 업데이트에 적합)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: number,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        updatePostDto: UpdatePostDto,
    ): Promise<PostEntity> {
        return this.postsService.updatePost(id, updatePostDto);
    }

    /**
     * 특정 ID를 가진 블로그 게시물을 삭제하는 API 엔드포인트입니다.
     * @param id 삭제할 게시물의 ID
     * @returns 성공 메시지 객체
     */
    @Delete(':id')
    @HttpCode(HttpStatus.OK) // 204 No Content 대신 200 OK로 변경하여 바디에 메시지 포함
    async remove(@Param('id') id: number): Promise<{ message: string }> { // 반환 타입 변경
        await this.postsService.deletePost(id);
        return { message: `ID가 ${id}인 게시물이 성공적으로 삭제되었습니다.` };
    }
}