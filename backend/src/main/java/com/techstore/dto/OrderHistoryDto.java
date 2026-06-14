package com.techstore.dto;

import com.techstore.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderHistoryDto {

    private Long orderId;
    private LocalDateTime createdAt;
    private BigDecimal total;
    private Integer totalItems;
    private OrderStatus status; // ДОДАНО ПОЛЕ СТАТУСУ
    private List<OrderHistoryItemDto> items;

    public OrderHistoryDto() {
    }

    public OrderHistoryDto(
            Long orderId,
            LocalDateTime createdAt,
            BigDecimal total,
            Integer totalItems,
            OrderStatus status, // ДОДАНО У КОНСТРУКТОР
            List<OrderHistoryItemDto> items
    ) {
        this.orderId = orderId;
        this.createdAt = createdAt;
        this.total = total;
        this.totalItems = totalItems;
        this.status = status;
        this.items = items;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public List<OrderHistoryItemDto> getItems() { return items; }
    public void setItems(List<OrderHistoryItemDto> items) { this.items = items; }
}