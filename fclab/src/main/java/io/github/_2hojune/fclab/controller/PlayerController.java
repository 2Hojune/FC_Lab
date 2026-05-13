package io.github._2hojune.fclab.controller;


import io.github._2hojune.fclab.service.NexonApiService;
import io.github._2hojune.fclab.service.PlayerSearchService;
import io.github._2hojune.fclab.service.PlayerStatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

// @Tag: 컨트롤러 전체를 설명하는 그룹 이름과 설명
@Tag(name = "Player API", description = "선수 검색 및 능력치 조회 API")
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/api/players")
public class PlayerController {

    private final NexonApiService nexonApiService;
    private final PlayerSearchService playerSearchService;
    private final PlayerStatService playerStatService;

    public PlayerController(NexonApiService nexonApiService, PlayerSearchService playerSearchService, PlayerStatService playerStatService) {
        this.nexonApiService = nexonApiService;
        this.playerSearchService = playerSearchService;
        this.playerStatService = playerStatService;
    }

    // @Operation: API의 목적을 요약
    @Operation(summary = "선수 이름 검색", description = "선수 이름을 입력하여 일치하는 선수들의 기본 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "선수 검색 성공"),
            @ApiResponse(responseCode = "404", description = "해당 이름을 가진 선수를 찾을 수 없음")
    })
    @GetMapping("/search")
    public List<JsonNode> searchPlayerByName(
            @Parameter(description = "검색할 선수의 이름", example = "손흥민")
            @RequestParam("name") String name) {

        return playerSearchService.searchPlayerByName(name);

    }

    @Operation(summary = "선수 상세 능력치 조회", description = "선수의 고유 식별자(spid)를 통해 상세 능력치(스탯)를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "능력치 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 spid를 가진 선수를 찾을 수 없음")
    })
    @GetMapping("/ability/{spid}")
    public Map<String, String> getAbility(
            @Parameter(description = "선수의 고유 식별자 (spid)", example = "201200104")
            @PathVariable("spid") int spid) {
        return playerStatService.getPlayerAbility(spid);
    }

}
