/** src/main.ts */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * 전역 파이프 설정
   * ValidationPipe를 전역으로 사용하면 모든 컨트롤러에 들어오는 요청의 유효성을 검사할 수 있습니다.
   */
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
        forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러 발생
        transform: true, // 요청 데이터를 DTO 타입으로 변환
      }),
  );

  /**
   * Swagger 설정
   * DocumentBuilder를 사용하여 Swagger 문서의 기본 구조(제목, 설명, 버전 등)를 설정합니다.
   */
  const config = new DocumentBuilder()
      .setTitle('블로그 API 문서')
      .setDescription('NestJS로 만드는 블로그 서버의 API 문서입니다.')
      .setVersion('1.0')
      .addTag('posts', '게시물 관련 API') // API 그룹 태그 추가
      .build();

  /**
   * Swagger 문서 생성
   * SwaggerModule.createDocument()를 사용하여 app과 config를 기반으로 문서를 생성합니다.
   */
  const document = SwaggerModule.createDocument(app, config);

  /**
   * Swagger UI 설정
   * SwaggerModule.setup()을 통해 '/api-docs' 경로에 Swagger UI를 생성합니다.
   * 이제 http://localhost:3000/api-docs 로 접속하여 API 문서를 확인할 수 있습니다.
   */
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();