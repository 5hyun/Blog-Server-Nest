/** src/modules/posts/posts.module.ts */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller'; // PostsController 임포트
import { PostsService } from './posts.service'; // PostsService 임포트
import { Post } from './posts.entity'; // Post 엔티티 임포트

@Module({
    imports: [TypeOrmModule.forFeature([Post])], // Post 엔티티를 이 모듈에서 사용할 수 있도록 등록
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}