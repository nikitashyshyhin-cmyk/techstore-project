package com.techstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderConfirmationResponse {

    private Long orderId;
    private BigDecimal total;
    private String status;
    private LocalDateTime createdAt;

    public OrderConfirmationResponse() {
    }

    public OrderConfirmationResponse(
            Long orderId,
            BigDecimal total,
            String status,
            LocalDateTime createdAt
    ) {
        this.orderId = orderId;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}