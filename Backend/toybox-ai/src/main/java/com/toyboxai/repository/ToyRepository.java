package com.toyboxai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toyboxai.model.Toy;

public interface ToyRepository extends JpaRepository<Toy, Long> {
    List<Toy> findByCategory(String category);
    List<Toy> findByNameContainingIgnoreCase(String keyword);
}