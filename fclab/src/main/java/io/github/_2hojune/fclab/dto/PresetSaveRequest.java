package io.github._2hojune.fclab.dto;

import java.util.List;

// 💡 프론트엔드가 백엔드로 "이 프리셋 저장해줘!" 하고 보낼 때 쓸 택배 상자
public record PresetSaveRequest(
        String presetName,
        List<PlayerSettingDto> players
) {
    // 💡 개별 선수 정보 상자
    public record PlayerSettingDto(
            int spid,
            String name,
            String seasonName,
            String seasonImg,
            int grade,
            int adaptability,
            String teamColor,
            String focusTraining // JSON 형태의 문자열 그대로 받기
    ) {}
}