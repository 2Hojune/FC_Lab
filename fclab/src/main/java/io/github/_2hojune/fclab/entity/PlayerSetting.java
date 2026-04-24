package io.github._2hojune.fclab.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "player_setting")
public class PlayerSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 💡 N:1 (다대일) 관계: 이 세팅이 어떤 프리셋에 속해 있는지 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preset_id", nullable = false)
    private PlayerPreset playerPreset;

    @Column(nullable = false)
    private int spid;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "season_name", nullable = false, length = 50)
    private String seasonName;

    @Column(name = "season_img", nullable = false)
    private String seasonImg;

    // --- 유저 커스텀 세팅 (보정치) ---

    @Column(nullable = false)
    private int grade; // 강화 등급 (기본 1)

    @Column(nullable = false)
    private int adaptability; // 적응도 (기본 5)

    @Column(name = "team_color", length = 50)
    private String teamColor; // 팀 컬러 식별값

    // 💡 MySQL의 JSON 타입을 지원하도록 설정 (배열 형태의 집중 훈련 스탯)
    @Column(name = "focus_training", columnDefinition = "json")
    private String focusTraining;

    @Builder
    public PlayerSetting(PlayerPreset playerPreset, int spid, String name, String seasonName, String seasonImg, int grade, int adaptability, String teamColor, String focusTraining) {
        this.playerPreset = playerPreset;
        this.spid = spid;
        this.name = name;
        this.seasonName = seasonName;
        this.seasonImg = seasonImg;
        this.grade = grade;
        this.adaptability = adaptability;
        this.teamColor = teamColor;
        this.focusTraining = focusTraining;
    }
}