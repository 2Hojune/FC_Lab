package io.github._2hojune.fclab.controller;

import io.github._2hojune.fclab.dto.PresetSaveRequest;
import io.github._2hojune.fclab.service.PresetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/api/players")
public class PresetController {

    private final PresetService presetService;

    public PresetController(PresetService presetService) {
        this.presetService = presetService;
    }


    @PostMapping
    public ResponseEntity<?> savePreset(@RequestBody PresetSaveRequest request) {

        Long saveId = presetService.savePreset(request);

        return ResponseEntity.ok(Map.of(
           "massge", "프리셋 저장 성공",
           "presetId", saveId
        ));
    }
}
