package io.github._2hojune.fclab.repository;

import io.github._2hojune.fclab.entity.PlayerPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerPresetRepository extends JpaRepository<PlayerPreset, Long> {

}
