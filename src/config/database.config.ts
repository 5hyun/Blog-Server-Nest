/** src/config/database.config.ts (예시) */
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: 'postgres',
    host: 'localhost', // Docker Compose로 실행했으므로 localhost로 접근
    /**
     * POSTGRES_PORT 환경 변수가 없을 경우 기본값 5432를 사용합니다.
     * parseInt는 첫 번째 인자로 문자열을 기대하므로,
     * undefined가 들어올 가능성을 명시적으로 처리합니다.
     */
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    autoLoadEntities: true, // 필요한 경우
    synchronize: true, // 개발 환경에서만 사용, 프로덕션에서는 migration 사용 권장
}));