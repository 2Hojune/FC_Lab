package io.github._2hojune.fclab.dto;

// 프론트 -> 백엔드 (선수 딱 1명 저장용)
public record SavedPlayerRequest(
        String buildName,     // 유저가 지은 이름
        int spid,             // 선수 고유 번호
        int grade,            // 강화 등급
        int adaptability,     // 적응도
        String teamColor,     // 팀 컬러
        String focusTraining  // 집중 훈련 (JSON 형태의 문자열)
) {}