package io.github._2hojune.fclab.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    // 1. API 문서의 전역 정보 설정 (제목, 설명, 버전 등)
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("개인 프로젝트 API 명세서")
                        .version("v1.0.0")
                        .description("OOO 프로젝트의 API 문서입니다."));

    }

    // 2. API 그룹화 설정
    // /api/** 로 시작하는 모든 URL을 "개인 프로젝트 API"라는 그룹으로 묶음
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("개인 프로젝트 API") // Swagger UI 드롭다운에 표시될 이름
                .pathsToMatch("/api/**")    // 이 그룹에 포함시킬 API 경로 패턴
                .build();
    }
}