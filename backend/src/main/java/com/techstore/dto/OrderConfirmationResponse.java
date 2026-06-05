package com.techstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderConfirmationResponse {

    private BigDecimal total;
    private String status;
    private LocalDateTime createdAt;

    private String deliveryAddress;
    private String paymentMethod;

    public OrderConfirmationResponse() {
    }

    public OrderConfirmationResponse(
            BigDecimal total,
            String status,
            LocalDateTime createdAt,
            String deliveryAddress,
            String paymentMethod
    ) {
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
        this.deliveryAddress = deliveryAddress;
        this.paymentMethod = paymentMethod;
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

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}