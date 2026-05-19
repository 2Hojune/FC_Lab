package io.github._2hojune.fclab.repository;

import io.github._2hojune.fclab.entity.Member;
import io.github._2hojune.fclab.entity.SavedPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
}
