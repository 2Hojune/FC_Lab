package io.github._2hojune.fclab.service;

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


        @Test
        @DisplayName("이름으로 선수 검색 시 결과 리스트를 반환해야 한다")
        void searchPlayerByName() {
            // given (준비): 검색할 이름
            String searchName = "손흥민";

            // when (실행): 검색 메서드 호출
            List<JsonNode> result = nexonApiService.searchPlayerByName(searchName);

            System.out.println("검색 결과 개수: " + result.size() + "명");
            if (result.size() > 0) {
                System.out.println("검색된 선수: " + result.get(0).toString());

            }
                // then (검증)
                assertThat(result)
                        .isNotEmpty()
                        .extracting(node -> node.get("name").asText())
                        .first()
                        .isEqualTo(searchName);
         }

        @Test
        @DisplayName("선수 스텟 가져오기 테스트")
        void getPlayerAblilty() {
            //given (준비) : 마라도나 spid
            int spid = 100190042;

            //when(실행) : 서비스 메서드 호출
            Map<String, String> stats = nexonApiService.getPlayerAbility(spid);
            System.out.println("가져온 데이터 스텟: " + stats);

            //then(검증) : 확인
            assertThat(stats)
                    .isNotEmpty()
                    .containsEntry("name", "마라도나")
                    .containsKey("드리블");


        }

    }
