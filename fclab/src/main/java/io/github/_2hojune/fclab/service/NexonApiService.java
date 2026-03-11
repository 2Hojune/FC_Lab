package io.github._2hojune.fclab.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class NexonApiService {

    @Value("${nexon.api.key}")
    private String apiKey;

    @Value("${nexon.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public NexonApiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // 이름 검색 메서드
    public List<JsonNode> searchPlayerByName(String name) {
        String url = "https://open.api.nexon.com/static/fconline/meta/spid.json";
        List<JsonNode> foundPlayers = new ArrayList<>();

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            JsonNode rootArray = objectMapper.readTree(jsonResponse);

            // 전체 명단을 돌면서 내가 입력한 '이름'이 포함된 선수를 주음
            for (JsonNode playerNode : rootArray) {
                if (playerNode.get("name").asText().contains(name)) {
                    foundPlayers.add(playerNode);
                }
            }

            return foundPlayers;
        } catch (Exception e) {
            return foundPlayers;

        }
    }

    public String getPlayerInfo(int spid) {
        // 1. 유저가 아닌 '선수 메타데이터' 주소
        String url = "https://open.api.nexon.com/static/fconline/meta/spid.json";

        try {
            // 2. 넥슨 서버에서 전체 선수 명단(JSON) 가져오기
            String jsonResponse = restTemplate.getForObject(url, String.class);

            // 3. 거대한 JSON 명단에서 내가 찾는 spid 딱 한 명만 쏙 뽑아내기
            JsonNode rootArray = objectMapper.readTree(jsonResponse);

            for (JsonNode playerNode : rootArray) {
                if (playerNode.get("id").asInt() == spid) {
                    // {"id": 101000208, "name": "리오넬 메시"} 반환
                    return playerNode.toString();
                }
            }
            return "해당 spid를 가진 선수가 없습니다.";

        } catch (Exception e) {
            return "API 호출 중 에러 발생: " + e.getMessage();

        }

    }
    }
