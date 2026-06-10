package com.techstore.dto;

import com.techstore.entity.OrderStatus;

public class OrderStatusUpdateRequest {
    private OrderStatus status;

    public OrderStatusUpdateRequest() {
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
