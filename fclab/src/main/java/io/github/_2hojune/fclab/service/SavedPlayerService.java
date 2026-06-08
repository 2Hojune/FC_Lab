package io.github._2hojune.fclab.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.github._2hojune.fclab.dto.SavedPlayerRequest;
import io.github._2hojune.fclab.dto.SavedPlayerResponse;
import io.github._2hojune.fclab.entity.Member;
import io.github._2hojune.fclab.entity.SavedPlayer;
import io.github._2hojune.fclab.repository.MemberRepository;
import io.github._2hojune.fclab.repository.SavedPlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;


import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SavedPlayerService {
    private final SavedPlayerRepository savedPlayerRepository;
    private final MemberRepository memberRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public Long savePlayer(Long memberId, SavedPlayerRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        //Map -> String 변환 (직렬화)
        String focusTrainingString ="";
        if (request.focusTraining() != null) {
            focusTrainingString = objectMapper.writeValueAsString(request.focusTraining());
        }

        SavedPlayer savedPlayer = SavedPlayer.builder()
                .member(member)
                .buildName(request.buildName())
                .spid(request.spid())
                .grade(request.grade())
                .adaptability(request.adaptability())
                .teamColor(request.teamColor())
                .focusTraining(focusTrainingString)
                .build();

        // DB 저장 후 ID 반환
        return savedPlayerRepository.save(savedPlayer).getId();
    }

    //-----------------------------------------------------------------------------------------------------------------------
    // 회원의 저장된 선수 목록 조회
    public List<SavedPlayerResponse> getSavedPlayers(Long memberId) {
        List<SavedPlayer> players = savedPlayerRepository.findByMember_Id(memberId);

        return players.stream()
                .map(player -> {
                    // DB의 String -> Map 변환 (역직렬화)
                    Map<String, Integer> focusTrainingMap = null;
                    if (player.getFocusTraining() != null && !player.getFocusTraining().isEmpty()) {
                        focusTrainingMap = objectMapper.readValue(
                                player.getFocusTraining(),
                                new TypeReference<>() {
                                }
                        );
                    }

                    return new SavedPlayerResponse(
                            player.getId(),
                            player.getBuildName(),
                            player.getSpid(),
                            player.getGrade(),
                            player.getAdaptability(),
                            player.getTeamColor(),
                            focusTrainingMap
                    );
                })
                .toList();
    }

    //-----------------------------------------------------------------------------------------------------------------------

    @Transactional
    public void deletePlayer(Long memberId, Long savedPlayerId) {
        // 1. 삭제할 선수가 DB에 존재하는지 확인
        SavedPlayer savedPlayer = savedPlayerRepository.findById(savedPlayerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 저장된 선수를 찾을 수 없습니다. (ID: " + savedPlayerId + ")"));

        // 2. 권한 검증: ID 확인
        if (!savedPlayer.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("이 선수를 삭제할 권한이 없습니다.");
        }

        savedPlayerRepository.delete(savedPlayer);
    }

    //-----------------------------------------------------------------------------------------------------------------------

    @Transactional
    public void updatePlayer(Long memberId, Long savedPlayerId, SavedPlayerRequest request) {

        // 1. 수정할 선수가 DB에 존재하는지 확인
        SavedPlayer savedPlayer = savedPlayerRepository.findById(savedPlayerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 저장된 선수를 찾을 수 없습니다."));

        // 2. 권한 검증: 이 선수의 주인과 요청한 유저가 일치하는지 확인
        if (!savedPlayer.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("이 선수를 수정할 권한이 없습니다.");
        }

        // 3. Map -> String 변환 (직렬화)
        String focusTrainingString = "";
        try {
            if (request.focusTraining() != null) {
                focusTrainingString = objectMapper.writeValueAsString(request.focusTraining());
            }
        } catch (Exception e) {
            throw new RuntimeException("집중 훈련 데이터 변환 실패(수정)", e);
        }

        // 4. 엔티티 값 변경 (JPA 더티 체킹 발동! -> 트랜잭션 종료 시 자동 UPDATE 쿼리 발생)
        savedPlayer.update(
                request.buildName(),
                request.grade(),
                request.adaptability(),
                request.teamColor(),
                focusTrainingString
        );
    }

    }
