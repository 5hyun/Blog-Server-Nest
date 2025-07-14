/** src/modules/posts/dto/create-post.dto.ts */
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty({ message: '제목은 필수 항목입니다.' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: '내용은 필수 항목입니다.' })
    content: string;

    @IsNumber()
    authorId: number;
}