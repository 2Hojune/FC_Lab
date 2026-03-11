package io.github._2hojune.fclab.entity;

import jakarta.persistence.*;
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

    @Column(nullable = false, length = 100)
    private String buildName;

    @Column(nullable = false)
    private Integer spid;

    @Column(length = 50)
    private String teamColor;

    // JSON 형태의 문자열이 들어갈 자리
    @Column(columnDefinition = "json")
    private String focusTraining;

    @Column(columnDefinition = "json")
    private String traits;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}