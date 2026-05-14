package com.techstore.dto;

import java.math.BigDecimal;

public class ProductDetailResponse {
    private Long id;
    private String name;
    private String description; // Повний опис
    private BigDecimal price;
    private String imageUrl;

    public ProductDetailResponse(Long id, String name, String description, BigDecimal price, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
    }
    // Геттери
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
}
