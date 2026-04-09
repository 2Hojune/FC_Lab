package io.github._2hojune.fclab.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

// 핵심 1: 스프링 부트 전체를 띄우지 않고, Mockito 가짜 환경만 가볍게 띄웁니다.
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NexonApiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    //검색 서비스가 사용할 JSON 파싱 도구
    private final ObjectMapper objectMapper = new ObjectMapper();

    private PlayerSearchService playerSearchService;
    private PlayerStatService playerStatService;


    @BeforeEach
    void setUp() {
        //@InjectMocks 대신 직접 조립(수동 주입)
        playerSearchService = new PlayerSearchService(restTemplate, objectMapper);
        playerStatService = new PlayerStatService(restTemplate);
    }

    // ==========================================
    // 📂 첫 번째 폴더: 스탯 크롤링 서비스 테스트
    // ==========================================
    @Nested
    @DisplayName("playerStatService 테스트")
    class StatServiceTest {

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
            Map<String, String> stats = playerStatService.getPlayerAbility(spid);
            System.out.println(stats);

            // Then (검증): 가짜 HTML을 Jsoup이 정확하게 잘라내서(파싱) Map에 담았는지 확인
            assertThat(stats)
                    .isNotEmpty()
                    .containsEntry("name", "마라도나")
                    .containsEntry("속력", "131")
                    .containsEntry("골 결정력", "127");

        }


    }

    // ==========================================
    // 📂 두 번째 폴더: 선수 검색 및 캐싱 서비스 테스트
    // =========================================

    @Nested
    @DisplayName("PlayerSearchService 테스트")
    class SearchServiceTest {

        @Test
        @DisplayName("시즌 데이터가 캐싱되고, 결과 JSON에 seasonName과 seasonImg가 주입된다")
        void searchPlayerByNameWithSeasonCacheTest() throws Exception {

            // Given
            String fakeSeasonResponse = """
                    [
                        {
                            "seasonId": 100,
                            "className": "ICON",
                            "seasonImg": "https://fake.url/icon.png"
                        }
                    ]
                    """;

            String fakeSpidResponse = """
                    [
                        {
                            "id": 100190042,
                            "name": "마라도나"
                        },
                        {
                            "id": 201190042,
                            "name": "마라도나"
                        }
                    ]
                    """;
            when(restTemplate.getForObject(contains("seasonid.json"), eq(String.class)))
                    .thenReturn(fakeSeasonResponse);
            when(restTemplate.getForObject(contains("spid.json"), eq(String.class)))
                    .thenReturn(fakeSpidResponse);

            //when
            playerSearchService.initSeasonCache(); //캐시 수동초기화
            List<JsonNode> result = playerSearchService.searchPlayerByName("마라도나");

            //Then
            assertThat(result);

            //첫 번째 결과(캐시 적중)
            JsonNode iconMaradona = result.get(0);
            assertThat(iconMaradona.path("seasonName").asText()).isEqualTo("ICON");
            assertThat(iconMaradona.path("seasonImg").asText()).isEqualTo("https://fake.url/icon.png");

            // 두 번째 결과 (캐시 미적중 - 방어 로직)
            JsonNode unKnownMaradona = result.get(1);
            assertThat(unKnownMaradona.path("seasonName").asText()).isEqualTo("Unknown");
            assertThat(unKnownMaradona.path("seasonImg").asText()).isEmpty();
        }
    }
}
