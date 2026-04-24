package io.github._2hojune.fclab.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "player_preset")
public class PlayerPreset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "preset_name", nullable = false, length = 100)
    private String presetName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 💡 프리셋이 삭제되면 안에 있는 선수 세팅들도 함께 삭제되도록 Cascade 설정
    @OneToMany(mappedBy = "playerPreset", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlayerSetting> playerSettings = new ArrayList<>();

    @Builder
    public PlayerPreset(String presetName) {
        this.presetName = presetName;
    }
    }
