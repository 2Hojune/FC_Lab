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

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SavedPlayerService {
    private final SavedPlayerRepository savedPlayerRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long savePlayer(Long memberId, SavedPlayerRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        SavedPlayer savedPlayer = SavedPlayer.builder()
                .member(member)
                .buildName(request.buildName())
                .spid(request.spid())
                .grade(request.grade())
                .adaptability(request.adaptability())
                .teamColor(request.teamColor())
                .focusTraining(request.focusTraining())
                .build();

        // DB 저장 후 ID 반환
        return savedPlayerRepository.save(savedPlayer).getId();
    }

    // 회원의 저장된 선수 목록 조회
    public List<SavedPlayerResponse> getSavedPlayers(Long memberId) {
        List<SavedPlayer> players = savedPlayerRepository.findByMember_Id(memberId);

        return players.stream()
                .map(player -> new SavedPlayerResponse(
                        player.getId(),
                        player.getBuildName(),
                        player.getSpid(),
                        player.getGrade(),
                        player.getAdaptability(),
                        player.getTeamColor(),
                        player.getFocusTraining()
                ))
                .toList();
    }

}
