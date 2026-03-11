package io.github._2hojune.fclab.controller;


import io.github._2hojune.fclab.service.NexonApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.JsonNode;

import java.util.List;

@RestController
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

    // spid 검색
    @GetMapping("/{spid}")
    public String seachPlayer(@PathVariable int spid) {
        return nexonApiService.getPlayerInfo(spid);
    }
}
