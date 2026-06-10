package com.techstore.dto;

import java.math.BigDecimal;

public class OrderHistoryItemDto {
    private String name;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;

    public OrderHistoryItemDto(String name, String imageUrl, Integer quantity, BigDecimal price, BigDecimal subtotal) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = subtotal;
    }

    public String getName() { return name; }
    public String getImageUrl() { return imageUrl; }
    public Integer getQuantity() { return quantity; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getSubtotal() { return subtotal; }
}