/** src/modules/posts/dto/create-post.dto.ts */
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({
        description: '게시물 제목',
        example: 'NestJS는 정말 최고예요!',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: '제목은 필수 항목입니다.' })
    title: string;

    @ApiProperty({
        description: '게시물 내용',
        example: 'NestJS를 사용해서 멋진 백엔드 서버를 만들어보세요.',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: '내용은 필수 항목입니다.' })
    content: string;

    @ApiProperty({
        description: '작성자 ID',
        example: 1,
        required: true,
    })
    @IsNumber()
    authorId: number;
}