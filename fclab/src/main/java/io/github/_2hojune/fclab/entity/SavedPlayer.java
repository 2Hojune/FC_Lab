package io.github._2hojune.fclab.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
public class SavedPlayer {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Member 객체와 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 커스텀 네임(ex: 양발, 신규특성)
    @Column(nullable = false, length = 100)
    private String buildName;

    @Column(nullable = false)
    private int spid;


    // 유저 세팅 값
    @Column(nullable = false)
    private int grade; // 강화등급

    @Column(nullable = false)
    private int adaptability; // 적응도 (기본 1)

    @Column(name = "team_color", length = 50)
    private String teamColor; // 팀 컬러

    @Column(name = "focus_training", columnDefinition = "json")
    private String focusTraining; // 집중 훈련 (json)

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    @Builder
    public SavedPlayer(Member member, String buildName, int spid, int grade, int adaptability, String teamColor, String focusTraining) {
        this.member = member;
        this.buildName = buildName;
        this.spid = spid;
        this.grade = grade;
        this.adaptability = adaptability;
        this.teamColor = teamColor;
        this.focusTraining = focusTraining;
    }
}