/** src/modules/posts/posts.service.ts */
import { Injectable, NotFoundException } from '@nestjs/common'; // NotFoundException 임포트
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './posts.entity'; // Post 엔티티 임포트
import { CreatePostDto } from './dto/create-post.dto'; // CreatePostDto 임포트
import * as sanitizeHtml from 'sanitize-html';
import { UpdatePostDto } from './dto/update-post.dto'; // UpdatePostDto 임포트

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    /**
     * 새로운 블로그 게시물을 생성합니다.
     * @param createPostDto 블로그 생성 데이터 (제목, 내용)
     * @param authorId 게시물을 작성하는 사용자의 ID
     * @returns 생성된 블로그 게시물 객체
     */
    async createPost(createPostDto: CreatePostDto): Promise<Post> { // authorId 파라미터 추가
        // content 필드 살균 처리
        const sanitizedContent = sanitizeHtml(createPostDto.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'blockquote',
                'ul', 'ol', 'li', 'a', 'img', 'strong', 'em', 'u', 's', 'code', 'pre',
                'table', 'thead', 'tbody', 'tr', 'th', 'td'
            ]), // 허용할 HTML 태그 목록 (기본값 + 추가 태그)
            allowedAttributes: {
                'a': [ 'href', 'name', 'target' ], // a 태그에 허용할 속성
                'img': [ 'src', 'alt', 'width', 'height' ], // img 태그에 허용할 속성
                '*': ['class', 'style'] // 모든 태그에 허용할 공통 속성
            },
            allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],
            // 'allowComments'는 타입 오류가 발생하여 제거했습니다.
            // 필요하다면 sanitize-html 라이브러리 버전을 확인하거나, 다른 방식으로 처리해야 할 수 있습니다.
        });

        const newPost = this.postRepository.create({
            ...createPostDto,
            content: sanitizedContent, // 살균 처리된 content 저장
        });
        return await this.postRepository.save(newPost);
    }

    /**
     * 모든 블로그 게시물을 조회합니다.
     * @returns 모든 블로그 게시물 목록
     */
    async findAllPosts(): Promise<Post[]> {
        return await this.postRepository.find();
    }

    /**
     * 특정 ID를 가진 블로그 게시물을 조회합니다.
     * 조회수를 1 증가시킵니다.
     * @param id 조회할 게시물의 ID
     * @returns 조회된 블로그 게시물 객체 또는 undefined
     */
    async findOne(id: number): Promise<Post | null> {
        const post = await this.postRepository.findOne({ where: { id } });
        if (post) {
            post.views += 1; // 조회수 1 증가
            await this.postRepository.save(post); // 변경된 조회수 저장
        }
        return post;
    }

    /**
     * 특정 ID를 가진 블로그 게시물을 수정합니다.
     * @param id 수정할 게시물의 ID
     * @param updatePostDto 게시물 업데이트 데이터
     * @returns 수정된 블로그 게시물 객체
     * @throws NotFoundException 게시물을 찾을 수 없을 경우
     */
    async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
        const post = await this.postRepository.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException(`ID가 ${id}인 게시물을 찾을 수 없습니다.`);
        }

        // content 필드 살균 처리 (업데이트 시에도 적용)
        if (updatePostDto.content) {
            updatePostDto.content = sanitizeHtml(updatePostDto.content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'blockquote',
                    'ul', 'ol', 'li', 'a', 'img', 'strong', 'em', 'u', 's', 'code', 'pre',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td'
                ]),
                allowedAttributes: {
                    'a': [ 'href', 'name', 'target' ],
                    'img': [ 'src', 'alt', 'width', 'height' ],
                    '*': ['class', 'style']
                },
                allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],
            });
        }

        // TypeORM의 merge 메서드를 사용하여 기존 엔티티에 DTO 데이터를 병합
        const updatedPost = this.postRepository.merge(post, updatePostDto);
        return await this.postRepository.save(updatedPost);
    }

    /**
     * 특정 ID를 가진 블로그 게시물을 삭제합니다.
     * @param id 삭제할 게시물의 ID
     * @returns void
     * @throws NotFoundException 게시물을 찾을 수 없을 경우
     */
    async deletePost(id: number): Promise<void> {
        const result = await this.postRepository.delete(id);

        if (result.affected === 0) { // 삭제된 행이 없을 경우
            throw new NotFoundException(`ID가 ${id}인 게시물을 찾을 수 없습니다.`);
        }
    }
}