package com.techstore.service;

import com.techstore.dto.AddToCartRequest;
import com.techstore.dto.AddToCartResponse;
import com.techstore.dto.CartResponse;

public interface CartService {

    AddToCartResponse addToCart(
            Long userId,
            AddToCartRequest request
    );

    CartResponse getCart(Long userId);

    void clearCart(String email);
}