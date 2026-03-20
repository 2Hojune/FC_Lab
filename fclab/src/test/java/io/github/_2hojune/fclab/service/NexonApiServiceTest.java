package io.github._2hojune.fclab.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

// 핵심 1: 스프링 부트 전체를 띄우지 않고, Mockito 가짜 환경만 가볍게 띄웁니다.
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

    @ExtendWith(MockitoExtension.class)
    class NexonApiServiceTest {

        @Mock
        private RestTemplate restTemplate;

        @InjectMocks
        private NexonApiService nexonApiService;


        @Test
        @DisplayName("Mockito: 넥슨 서버 호출 없이, Jsoup HTML 파싱 로직만 순수하게 검증")
        void getPlayerAbilityWithTest() {
            // Given (준비):
            int spid = 100190042;

            String fakeHtmlResponse =
                    "<div class='info_name'><span class='name'>마라도나</span></div>" +
                            "<li class='ab'><span class='txt'>속력</span><span class='value'>131</span></li>" +
                            "<li class='ab'><span class='txt'>골 결정력</span><span class='value'>127</span></li>";

            // "postForObject 메서드가 호출되면, fakeHtmlResponse를 반환"
            when(restTemplate.postForObject(anyString(), any(), eq(String.class)))
                    .thenReturn(fakeHtmlResponse);

            // When (실행): 서비스 로직 실행 (이때 내부적으로 가짜 RestTemplate이 동작함)
            Map<String, String> stats = nexonApiService.getPlayerAbility(spid);
            System.out.println(stats);

            // Then (검증): 가짜 HTML을 Jsoup이 정확하게 잘라내서(파싱) Map에 담았는지 확인
            assertThat(stats)
                    .isNotEmpty()
                    .containsEntry("name", "마라도나")
                    .containsEntry("속력", "131")
                    .containsEntry("골 결정력", "127");

        }
    }
