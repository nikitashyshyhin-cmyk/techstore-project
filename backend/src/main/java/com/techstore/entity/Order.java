package com.techstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String deliveryAddress;
    private String paymentMethod;
    @Enumerated(EnumType.STRING)
    private DeliveryType deliveryType = DeliveryType.NOVA_POSHTA;
    private String comment;
    private BigDecimal total;
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.CREATED;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Order() {
    }

    public Order(User user, DeliveryType deliveryType, String deliveryAddress, String paymentMethod, String comment, BigDecimal total) {
        this.user = user;
        this.deliveryType = deliveryType;
        this.deliveryAddress = deliveryAddress;
        this.paymentMethod = paymentMethod;
        this.comment = comment;
        this.total = total;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public DeliveryType getDeliveryType() { return deliveryType; }
    public void setDeliveryType(DeliveryType deliveryType) { this.deliveryType = deliveryType; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
