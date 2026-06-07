package com.techstore.dto;

public class CartItemUpdateRequest {

    private Integer quantity;

    public CartItemUpdateRequest() {
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}