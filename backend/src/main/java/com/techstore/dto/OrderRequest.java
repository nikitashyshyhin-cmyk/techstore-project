package com.techstore.dto;

public class OrderRequest {
    private String deliveryAddress;
    private String paymentMethod;
    private String comment;

    public OrderRequest() {
    }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
