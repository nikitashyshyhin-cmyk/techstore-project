package com.techstore.dto;

import java.math.BigDecimal;

public class CreateOrderResponse {
    private Long orderId;
    private BigDecimal total;
    private String status;

    public CreateOrderResponse(Long orderId, BigDecimal total, String status) {
        this.orderId = orderId;
        this.total = total;
        this.status = status;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
