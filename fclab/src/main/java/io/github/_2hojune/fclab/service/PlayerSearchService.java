package io.github._2hojune.fclab.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PlayerSearchService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // 시즌 정보를 담아둘 메모리 캐시 (서버가 켜질 때 한 번만 채워짐)
    private final Map<Integer, String> seasonCache = new ConcurrentHashMap<>();
    //이미지 URL을 담아둘 메모리 캐시
    private final Map<Integer, String> seasonImgCache = new ConcurrentHashMap<>();

    public PlayerSearchService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }
    // 서버 실행 시 딱 한 번 실행되는 초기화 메서드 (넥슨 시즌 데이터 긁어오기)

    @PostConstruct
    public void initSeasonCache() {
        String seasonUrl = "https://open.api.nexon.com/static/fconline/meta/seasonid.json";
        try {
            String json = restTemplate.getForObject(seasonUrl, String.class);
            JsonNode sesonArray = objectMapper.readTree(json);

            // 가져온 시즌 배열을 돌면서 Map에 [시즌ID : 시즌명] 형태로 저장
            for (JsonNode node : sesonArray) {
                int seasonId = node.get("seasonId").asInt();
                String className = node.get("className").asText();

                String seasonImg = "";
                if (node.has("seasonImg") && !node.get("seasonImg").isNull()) {
                    seasonImg = node.get("seasonImg").asText();
                }
                seasonCache.put(seasonId, className);
                seasonImgCache.put(seasonId, seasonImg);
            }
            System.out.println("✅ FC Lab: 시즌 메타데이터 및 이미지 캐싱 완료!");
        } catch (Exception e) {
            System.err.println("❌ 시즌 데이터 로드 실패: " + e.getMessage());
        }
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

                    // spid에서 시즌 ID 추출
                    int spid = playerNode.get("id").asInt();
                    int seasonId = spid / 1000000; // 앞 3자리 추출

                    // 캐시에서 시즌 이름 찾기 (만약 없으면 "Unknown" 반환)
                    String seasonName = seasonCache.getOrDefault(seasonId, "Unknown");
                    // 캐시에서 이미지 주소 꺼내기
                    String seasonImg = seasonImgCache.getOrDefault(seasonId, "");

                    // JSON 객체(playerNode)에 seasonName 데이터를 끼워넣기 위해 ObjectNode로 변환
                    ObjectNode objectNode = (ObjectNode) playerNode;
                    objectNode.put("seasonName", seasonName);
                    objectNode.put("seasonImg", seasonImg);
                    foundPlayers.add(objectNode);
                }
            }
            return foundPlayers;
        } catch (Exception e) {
            return foundPlayers;
        }
    }
}
