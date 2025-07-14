/** src/modules/posts/dto/update-post.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

/**
 * 게시물 업데이트를 위한 DTO입니다.
 * PartialType을 사용하여 CreatePostDto의 모든 필드를 선택적으로 만듭니다.
 * 이 필드들은 유효성 검사 규칙을 CreatePostDto로부터 상속받습니다.
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {
    // 업데이트 시 authorId를 변경할 수 있도록 추가 (선택 사항)
    // 만약 authorId 변경을 허용하지 않거나, 별도 권한이 필요하다면 이 필드를 제거할 수 있습니다.
    // @IsNumber()
    // @IsOptional()
    // authorId?: number;
}