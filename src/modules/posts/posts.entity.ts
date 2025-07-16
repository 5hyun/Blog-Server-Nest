/** src/modules/posts/posts.entity.ts */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('posts')
export class Post {
    @ApiProperty({ description: '게시물 고유 ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: '게시물 제목' })
    @Column({ length: 255, nullable: false })
    title: string;

    @ApiProperty({ description: '게시물 내용 (HTML 형식)' })
    @Column({ type: 'text', nullable: false })
    content: string;

    @ApiProperty({ description: '작성자 이름', required: false })
    @Column({ length: 100, nullable: true })
    author: string;

    @ApiProperty({ description: '작성자 고유 ID', required: false })
    @Column({ nullable: true })
    authorId: number;

    @ApiProperty({ description: '조회수', default: 0 })
    @Column({ default: 0 })
    views: number;

    @ApiProperty({ description: '생성 일시' })
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @ApiProperty({ description: '수정 일시' })
    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}