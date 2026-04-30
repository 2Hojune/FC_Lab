package io.github._2hojune.fclab.service;

import io.github._2hojune.fclab.dto.PresetSaveRequest;
import io.github._2hojune.fclab.entity.PlayerPreset;
import io.github._2hojune.fclab.entity.PlayerSetting;
import io.github._2hojune.fclab.repository.PlayerPresetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PresetService {

    private final PlayerPresetRepository presetRepository;

    @Transactional // 💡 DB 작업 중 하나라도 뻑나면 전체 취소(롤백) 시켜주는 안전장치
    public Long savePreset(PresetSaveRequest request) {

        // 1. 부모 객체(프리셋 폴더) 생성
        PlayerPreset preset = PlayerPreset.builder()
                .presetName(request.presetName())
                .build();

        // 2. 자식 객체(개별 선수 세팅)들 생성해서 부모 폴더에 쏙쏙 집어넣기
        for (PresetSaveRequest.PlayerSettingDto dto : request.players()) {
            PlayerSetting setting = PlayerSetting.builder()
                    .playerPreset(preset) // 💡 "너의 부모는 이 프리셋이야!" 라고 이름표 달아주기
                    .spid(dto.spid())
                    .name(dto.name())
                    .seasonName(dto.seasonName())
                    .seasonImg(dto.seasonImg())
                    .grade(dto.grade())
                    .adaptability(dto.adaptability())
                    .teamColor(dto.teamColor())
                    .focusTraining(dto.focusTraining())
                    .build();

            // 부모의 리스트에 자식 추가
            preset.getPlayerSettings().add(setting);
        }

        // 3. 💥 마법의 순간: 부모(프리셋) 딱 하나만 저장합니다!
        // CascadeType.ALL 덕분에 안에 들어있는 선수 11명의 데이터도 알아서 DB에 INSERT 됩니다.
        PlayerPreset savedPreset = presetRepository.save(preset);

        // 방금 저장된 프리셋의 고유 번호(ID)를 반환
        return savedPreset.getId();
    }
}