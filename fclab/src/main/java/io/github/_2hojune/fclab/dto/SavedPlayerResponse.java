package io.github._2hojune.fclab.dto;

import java.util.Map;

public record SavedPlayerResponse(

        Long id, //순번
        String buildName,     // 유저가 지은 이름
        int spid,             // 선수 고유 번호
        int grade,            // 강화 등급
        int adaptability,     // 적응도
        String teamColor,     // 팀 컬러
        Map<String, Integer> focusTraining  // 집중 훈련 (JSON 형태의 문자열)
) {

}
