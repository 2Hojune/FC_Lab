package io.github._2hojune.fclab.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class PlayerStatService {

    private final RestTemplate restTemplate;

    public PlayerStatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, String> getPlayerAbility(int spid) {
        String url = "https://fconline.nexon.com/datacenter/PlayerAbility";
        Map<String, String> stats = new HashMap<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("User-Agent", "Mozilla/5.0");

            // POST로 보낼 파라미터 세팅 (spid를 담아서 보내야 함)
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("spid", String.valueOf(spid));
            params.add("n1Strong", "1"); // 1강 기준

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
            String html = restTemplate.postForObject(url, entity, String.class);

            // Jsoup
            Document doc = Jsoup.parse(html);

            // 선수 이름 추출
            stats.put("name", doc.select(".info_name .name").text());

            // 모든 능력치 항목(<li class="ab">)을 돌면서 텍스트와 값 추출
            Elements abilityList = doc.select("li.ab");
            for (Element ab : abilityList) {
                String title = ab.select(".txt").text(); // "속력", "가속력" 등
                String value = ab.select(".value").first().ownText().trim(); // "131" 등

                if (!title.isEmpty() && !value.isEmpty()) {
                    stats.put(title, value);
                }

            }
            return stats;

        } catch (Exception e) {
            stats.put("error", e.getMessage());
            return stats;

        }
    }
}

