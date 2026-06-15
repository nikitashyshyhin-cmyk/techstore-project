package com.techstore.dto;

import java.math.BigDecimal;

public class PopularProductDto {

    private Long id;
    private String name;
    private String shortDescription;
    private BigDecimal price;
    private String imageUrl;

    public PopularProductDto(
            Long id,
            String name,
            String shortDescription,
            BigDecimal price,
            String imageUrl
    ) {
        this.id = id;
        this.name = name;
        this.shortDescription = shortDescription;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}