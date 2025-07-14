/** src/app.module.ts */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // TypeOrmModuleOptions 임포트 추가
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig], // database.config.ts 로드
      envFilePath: ['.env'], // .env 파일 경로 지정 (프로젝트 루트에 있다면 일반적으로 명시하지 않아도 됨)
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        /**
         * configService.get('database')는 TypeOrmModuleOptions | undefined 타입을 반환할 수 있습니다.
         * undefined가 반환될 경우 런타임 에러를 방지하고 TypeScript 에러를 해결하기 위해
         * 반환값을 명시적으로 확인하고 처리해야 합니다.
         */
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');

        if (!dbConfig) {
          /**
           * 데이터베이스 설정이 로드되지 않았을 경우, 애플리케이션 실행에 필수적이므로
           * 명확하게 에러를 던져 문제를 인지하도록 합니다.
           * 이 에러는 애플리케이션 시작 시 발생하여 설정 문제를 빠르게 파악하게 해줍니다.
           */
          throw new Error('데이터베이스 설정이 누락되었거나 정의되지 않았습니다. .env 파일 및 database.config.ts를 확인해주세요.');
        }
        return dbConfig;
      },
    }),
      PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}