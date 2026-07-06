package com.toyboxai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toyboxai.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {}