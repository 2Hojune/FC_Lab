package io.github._2hojune.fclab.repository;

import io.github._2hojune.fclab.entity.SavedPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedPlayerRepository extends JpaRepository<SavedPlayer, Long> {

    List<SavedPlayer> findByMemberId(Long memberId);
}
