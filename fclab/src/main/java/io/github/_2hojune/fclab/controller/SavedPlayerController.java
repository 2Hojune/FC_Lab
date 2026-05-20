package io.github._2hojune.fclab.controller;

import io.github._2hojune.fclab.dto.SavedPlayerRequest;
import io.github._2hojune.fclab.dto.SavedPlayerResponse;
import io.github._2hojune.fclab.entity.SavedPlayer;
import io.github._2hojune.fclab.service.SavedPlayerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "SavedPlayer API", description = "선수 저장 API")
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/api/saved-players")
@RequiredArgsConstructor
public class SavedPlayerController {

    private final SavedPlayerService savedPlayerService;

    // 선수 저장 API
    @Operation(summary = "선수 설정 저장", description = "강화 등급, 팀 컬러, 집중 훈련 등을 적용한 선수 레시피를 보관함에 저장합니다.")    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "선수 저장 성공"),
            @ApiResponse(responseCode = "404", description = "회원을 찾을 수 없어 저장 실패")
    })
    @PostMapping
    public ResponseEntity<Long> savePlayer(
            @Parameter(description = "선수를 저장할 회원의 ID", example = "1")
            @RequestParam("memberId") Long memberId,
            @RequestBody SavedPlayerRequest request) {

        Long savedId = savedPlayerService.savePlayer(memberId, request);
        return ResponseEntity.ok(savedId);
    }

    // 저장된 선수 조회 API
    @Operation(summary = "저장된 선수 목록 조회", description = "특정 회원의 보관함에 저장된 모든 선수 리스트를 조회합니다. (비교 슬롯용)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (파라미터 누락 등)")
    })
    @GetMapping
    public ResponseEntity<List<SavedPlayerResponse>> getSavedPlayers(
            @Parameter(description = "조회할 회원의 고유 ID", example = "1")
            @RequestParam("memberId") Long memberId) {
        List<SavedPlayerResponse> list = savedPlayerService.getSavedPlayers(memberId);
        return ResponseEntity.ok(list);
    }
}