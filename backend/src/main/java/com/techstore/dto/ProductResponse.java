package com.techstore.dto;

import java.math.BigDecimal;
import java.util.Set;

public class ProductResponse {

    private Long id;
    private String name;
    private BigDecimal price;
    private String shortDescription;
    private String imageUrl;
    private Set<CategoryResponse> categories;

    public ProductResponse(Long id, String name, BigDecimal price, String shortDescription, String imageUrl,
            Set<CategoryResponse> categories) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.shortDescription = shortDescription;
        this.imageUrl = imageUrl;
        this.categories = categories;
    }

    // getters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}