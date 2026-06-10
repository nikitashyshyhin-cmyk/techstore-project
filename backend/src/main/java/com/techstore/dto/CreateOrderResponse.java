package com.techstore.dto;

import java.math.BigDecimal;
import com.techstore.entity.OrderStatus;

public class CreateOrderResponse {
    private Long orderId;
    private BigDecimal total;
    private OrderStatus status;

    public CreateOrderResponse(Long orderId, BigDecimal total, OrderStatus status) {
        this.orderId = orderId;
        this.total = total;
        this.status = status;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
