package com.techstore.dto;

import java.math.BigDecimal;
import java.util.List;

public class CheckoutResponse {

    private List<CartItemDto> items;
    private BigDecimal total;

    public CheckoutResponse() {
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
