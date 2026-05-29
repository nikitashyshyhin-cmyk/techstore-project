package com.techstore.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartResponse {

    private List<CartItemDto> items;
    private BigDecimal totalCartPrice;

    public CartResponse() {
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public BigDecimal getTotalCartPrice() {
        return totalCartPrice;
    }

    public void setTotalCartPrice(BigDecimal totalCartPrice) {
        this.totalCartPrice = totalCartPrice;
    }
}