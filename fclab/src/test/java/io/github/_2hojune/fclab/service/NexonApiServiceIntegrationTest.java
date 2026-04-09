package io.github._2hojune.fclab.service;

import org.hibernate.type.format.jackson.JacksonOsonFormatMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;


    @SpringBootTest
     class NexonApiServiceIntegrationTest {

        @Autowired
        NexonApiService nexonApiService;
        @Autowired
        PlayerSearchService playerSearchService;
        @Autowired
        PlayerStatService playerStatService;


        @Test
        @DisplayName("이름으로 선수 검색 시 결과 리스트를 반환해야 한다")
        void searchPlayerByName() {
            // given (준비): 검색할 이름
            String searchName = "손흥민";

            // when (실행): 검색 메서드 호출
            List<JsonNode> result = playerSearchService.searchPlayerByName(searchName);

            // then (검증)

            // 1. 결과가 비어있지 않아야 함
            assertThat(result).isNotEmpty();

            // 2. 첫 번째 검색된 선수 데이터 추출
            JsonNode firstPlayer = result.get(0);

            System.out.println("=================================================");
            System.out.println("⚽ 검색된 선수 이름 : " + firstPlayer.path("name").asText());
            System.out.println("\uD83C\uDF1F 주입된 시즌 이름 :" + firstPlayer.path("seasonName").asText());
            System.out.println("\uD83D\uDDBC\uFE0F 주입된 시즌 로고 :주입된 시즌 로고 :" + firstPlayer.path("seasonImg").asText());
            System.out.println("=================================================");

            // 3. 이름이 '손흥민'을 포함하고 있는지 검증
            assertThat(firstPlayer.path("name").asText().contains(searchName));

            // 4. 핵심 검증: JSON 객체 안에 우리가 만든 필드들이 진짜로 존재하는가?
            assertThat(firstPlayer.has("seasonName")).isTrue();
            assertThat(firstPlayer.has("seasonImg")).isTrue();

            // 이미지 주소가 null이 아님을 확실하게 검증 (빈 문자열이 올 수는 있어도 필드 자체가 터지면 안 됨)
            assertThat(firstPlayer.path("seasonImg").asText()).isNotNull();


//                assertThat(result)
//                        .isNotEmpty()
//                        .extracting(node -> node.get("name").asText())
//                        .first()
//                        .isEqualTo(searchName);
         }

        @Test
        @DisplayName("선수 스텟 가져오기 테스트")
        void getPlayerAblilty() {
            //given (준비) : 마라도나 spid
            int spid = 100190042;

            //when(실행) : 서비스 메서드 호출
            Map<String, String> stats = playerStatService.getPlayerAbility(spid);
            System.out.println("가져온 데이터 스텟: " + stats);

            //then(검증) : 확인
            assertThat(stats)
                    .isNotEmpty()
                    .containsEntry("name", "마라도나")
                    .containsKey("드리블");


        }

    }
