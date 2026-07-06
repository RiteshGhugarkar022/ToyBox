package com.toyboxai.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Toy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tId;

    private String name;
    private double price;
    private String description;
    private float ratings;
    private int stock;
    private String category;

    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String toyImage;
}