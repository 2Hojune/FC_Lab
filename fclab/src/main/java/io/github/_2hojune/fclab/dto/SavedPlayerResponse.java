package io.github._2hojune.fclab.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record SavedPlayerResponse(

        @Schema(description = "회원 ID", example = "1")
        Long id,

        @Schema(description = "유저가 작성한 이름", example = "신특 양발 쏜")
        String buildName,     // 유저가 지은 이름

        @Schema(description = "선수 고유 식별 번호 (SPID)", example = "101000208")
        int spid,             // 선수 고유 번호

        @Schema(description = "강화 등급", example = "5")
        int grade,            // 강화 등급

        @Schema(description = "적응도", example = "5")
        int adaptability,     // 적응도

        @Schema(description = "적용할 팀 컬러 식별값", example = "토트넘")
        String teamColor,     // 팀 컬러

        @Schema(description = "집중 훈련 포인트 설정값 (JSON 문자열)", example = "{\"speed\": 4, \"dribble\": 2}")
        String focusTraining  // 집중 훈련 (JSON 형태의 문자열)
) {

}
