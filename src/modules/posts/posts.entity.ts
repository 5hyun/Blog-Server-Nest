/** src/modules/posts/posts.entity.ts */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('posts') // 테이블 이름을 'posts'로 변경하는 것이 더 명확합니다.
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @Column({ length: 100, nullable: true })
    author: string;

    /**
     * 글쓴이의 고유 ID를 저장합니다.
     * 사용자 엔티티와의 관계를 설정할 수도 있지만,
     * 여기서는 간단히 숫자로 된 ID를 저장하도록 합니다.
     * 만약 실제 사용자 엔티티가 있다면 @ManyToOne 관계로 변경해야 합니다.
     */
    @Column({ nullable: true })
    authorId: number;

    /**
     * 게시물 조회수를 저장합니다.
     * 기본값은 0으로 설정하여 새로 생성된 게시물의 조회수가 0부터 시작하도록 합니다.
     */
    @Column({ default: 0 })
    views: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}