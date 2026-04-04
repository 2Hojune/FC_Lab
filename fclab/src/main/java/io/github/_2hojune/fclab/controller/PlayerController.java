package io.github._2hojune.fclab.controller;


import io.github._2hojune.fclab.service.NexonApiService;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/api/players")
public class PlayerController {
    private final NexonApiService nexonApiService;

    public PlayerController(NexonApiService nexonApiService) {
        this.nexonApiService = nexonApiService;
    }

    // 이름검색
    @GetMapping("/name/{name}")
    public List<JsonNode> searchPlayerByName(@PathVariable String name) {
        return nexonApiService.searchPlayerByName(name);

    }


    @GetMapping("/ability/{spid}")
    public Map<String, String> getAbility(@PathVariable int spid) {
        return nexonApiService.getPlayerAbility(spid);
    }

}
