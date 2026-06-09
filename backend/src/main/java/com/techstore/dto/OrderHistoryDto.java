package com.techstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderHistoryDto {

    private Long orderId;

    private LocalDateTime createdAt;

    private BigDecimal total;

    private Integer totalItems;

    private List<OrderHistoryItemDto> items;

    public OrderHistoryDto() {
    }

    public OrderHistoryDto(
            Long orderId,
            LocalDateTime createdAt,
            BigDecimal total,
            Integer totalItems,
            List<OrderHistoryItemDto> items
    ) {
        this.orderId = orderId;
        this.createdAt = createdAt;
        this.total = total;
        this.totalItems = totalItems;
        this.items = items;
    }

    public Long getOrderId() {
        return orderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public List<OrderHistoryItemDto> getItems() {
        return items;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public void setItems(
            List<OrderHistoryItemDto> items
    ) {
        this.items = items;
    }
}