package io.github._2hojune.fclab.controller;

import io.github._2hojune.fclab.dto.SavedPlayerRequest;
import io.github._2hojune.fclab.entity.SavedPlayer;
import io.github._2hojune.fclab.service.SavedPlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/api/saved-players")
@RequiredArgsConstructor
public class SavedPlayerController {

    private final SavedPlayerService savedPlayerService;

    // 선수 저장 API
    @PostMapping
    public ResponseEntity<Long> savePlayer(
            @RequestParam("memberId") Long memberId,
            @RequestBody SavedPlayerRequest request) {

        Long savedId = savedPlayerService.savePlayer(memberId, request);
        return ResponseEntity.ok(savedId);
    }

    // 저장된 선수 조회 API
    @GetMapping
    public ResponseEntity<List<SavedPlayer>> getSavedPlayers(
            @RequestParam("memberId") Long memberId) {
        List<SavedPlayer> list = savedPlayerService.getSavedPlayers(memberId);
        return ResponseEntity.ok(list);
    }
}