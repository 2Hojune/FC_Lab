package io.github._2hojune.fclab.controller;


import io.github._2hojune.fclab.service.NexonApiService;
import io.github._2hojune.fclab.service.PlayerSearchService;
import io.github._2hojune.fclab.service.PlayerStatService;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

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

    // 이름검색
    @GetMapping("/search")
    public List<JsonNode> searchPlayerByName(@RequestParam("name") String name) {
        return playerSearchService.searchPlayerByName(name);

    }

    @GetMapping("/ability/{spid}")
    public Map<String, String> getAbility(@PathVariable("spid") int spid) {
        return playerStatService.getPlayerAbility(spid);
    }

}
