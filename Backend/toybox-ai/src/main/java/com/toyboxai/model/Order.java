package com.toyboxai.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long oId;

    private double amount;
    private String status;
    private LocalDateTime date;

    @ManyToOne
    private User customer;

    @jakarta.persistence.OneToMany(mappedBy = "order", cascade = jakarta.persistence.CascadeType.ALL, fetch = jakarta.persistence.FetchType.EAGER)
    private java.util.List<OrderItem> items;

    private Integer rating;
}