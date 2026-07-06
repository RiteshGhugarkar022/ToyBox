package com.toyboxai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toyboxai.model.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer_LoginId(String loginId);
}