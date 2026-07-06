package com.toyboxai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toyboxai.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByLoginId(String loginId);
}