NestJS 블로그 서버 API
📝 프로젝트 개요
이 프로젝트는 NestJS 프레임워크를 기반으로 구축된 블로그용 백엔드 서버입니다. TypeORM을 사용하여 PostgreSQL 데이터베이스와 상호작용하며, 게시물(Post)에 대한 CRUD (생성, 조회, 수정, 삭제) API를 제공합니다.

또한, Swagger (OpenAPI) 를 연동하여 API 명세를 자동으로 문서화하고, 개발자들이 API를 쉽게 테스트하고 이해할 수 있는 환경을 제공합니다.

✨ 주요 기술 스택
Framework: NestJS

Database: PostgreSQL

ORM: TypeORM

API Documentation: Swagger (OpenAPI)

Validation: class-validator, class-transformer

Containerization: Docker

🌊 API 처리 흐름 (Request Flow)
클라이언트의 요청부터 응답까지의 전체적인 데이터 흐름은 다음과 같습니다.

클라이언트 요청 (Client Request)

클라이언트(웹 브라우저, 모바일 앱 등)가 특정 API 엔드포인트로 HTTP 요청을 보냅니다. (예: POST /posts)

컨트롤러 (Controller) - posts.controller.ts

NestJS의 라우팅 메커니즘이 요청된 URL과 HTTP 메서드에 맞는 핸들러 함수를 호출합니다.

@Body(), @Param(), @Query() 등의 데코레이터를 사용하여 요청 데이터를 DTO(Data Transfer Object)로 변환하고 유효성을 검사합니다.

서비스 (Service) - posts.service.ts

컨트롤러는 비즈니스 로직 처리를 서비스에 위임합니다.

서비스는 데이터베이스와 상호작용하거나, 필요한 비즈니스 로직(예: 조회수 증가, 데이터 가공)을 수행합니다.

특히, HTML 콘텐츠가 포함된 경우 sanitize-html 라이브러리를 사용하여 XSS(Cross-Site Scripting) 공격을 방지하기 위한 살균(Sanitization) 처리를 수행합니다.

리포지토리 (Repository) & 엔티티 (Entity) - posts.entity.ts

서비스는 TypeORM의 리포지토리 패턴을 사용하여 데이터베이스와 통신합니다.

Post 엔티티는 데이터베이스의 posts 테이블과 매핑되는 객체이며, 서비스와 리포지토리 사이에서 데이터를 주고받는 데 사용됩니다.

데이터베이스 (Database)

리포지토리를 통해 실행된 쿼리가 PostgreSQL 데이터베이스에서 처리됩니다.

클라이언트 응답 (Client Response)

처리 결과 데이터는 다시 서비스를 거쳐 컨트롤러로 반환됩니다.

컨트롤러는 이 데이터를 클라이언트에게 HTTP 응답으로 전송합니다. (주로 JSON 형식)

🚀 API 엔드포인트 명세
basePath: /posts

기능

HTTP Method

URL

요청 Body (DTO)

설명

게시물 생성

POST

/

CreatePostDto

새로운 게시물을 생성합니다.

전체 조회

GET

/

-

모든 게시물 목록을 조회합니다.

상세 조회

GET

/:id

-

특정 ID의 게시물을 상세 조회하고, 조회수를 1 증가시킵니다.

게시물 수정

PATCH

/:id

UpdatePostDto

특정 ID의 게시물을 수정합니다. (부분 업데이트 지원)

게시물 삭제

DELETE

/:id

-

특정 ID의 게시물을 삭제합니다.

DTO (Data Transfer Object)
CreatePostDto: 게시물 생성을 위해 클라이언트로부터 받는 데이터 모델입니다. title, content, authorId 필드를 포함합니다.

UpdatePostDto: 게시물 수정을 위해 사용되며, CreatePostDto의 모든 필드를 선택적으로 가집니다.

API 문서 확인
애플리케이션을 실행한 후, 아래 주소에서 상세한 API 명세와 테스트 UI를 확인할 수 있습니다.

Swagger UI: http://localhost:3000/api-docs