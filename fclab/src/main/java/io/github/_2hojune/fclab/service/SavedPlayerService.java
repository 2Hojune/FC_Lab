package io.github._2hojune.fclab.service;

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

    // 회원의 저장된 선수 목록 조회
    public List<SavedPlayerResponse> getSavedPlayers(Long memberId) {
        List<SavedPlayer> players = savedPlayerRepository.findByMember_Id(memberId);

        return players.stream()
                .map(player -> {
                    // DB의 String -> Map 변환 (역직렬화)
                    Map<String, Integer> focusTrainingMap = null;
                    if (player.getFocusTraining() != null && !player.getFocusTraining().isEmpty()) {
                        // Jackson에게 Map<String, Integer> 구조로 정밀하게 쪼개달라고 요청하는 코드입니다.
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
                            focusTrainingMap // 프론트엔드가 바로 사용할 수 있는 깨끗한 객체 전달!
                    );
                })
                .toList();
    }
    }