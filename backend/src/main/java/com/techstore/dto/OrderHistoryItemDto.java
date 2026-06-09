package com.techstore.dto;

public class OrderHistoryItemDto {

    private String productName;

    private Integer quantity;

    public OrderHistoryItemDto() {
    }

    public OrderHistoryItemDto(
            String productName,
            Integer quantity
    ) {
        this.productName = productName;
        this.quantity = quantity;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}