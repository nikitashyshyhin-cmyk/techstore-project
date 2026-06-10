package com.techstore.dto;

public class OrderRequest {
    private String deliveryAddress;
    private String paymentMethod;
    private com.techstore.entity.DeliveryType deliveryType;
    private String comment;

    public OrderRequest() {
    }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public com.techstore.entity.DeliveryType getDeliveryType() { return deliveryType; }
    public void setDeliveryType(com.techstore.entity.DeliveryType deliveryType) { this.deliveryType = deliveryType; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
