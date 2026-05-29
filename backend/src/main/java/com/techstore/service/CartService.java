package com.techstore.service;

import com.techstore.dto.AddToCartRequest;
import com.techstore.dto.CartItemResponse;
import com.techstore.dto.CartResponse;

public interface CartService {

    CartItemResponse addToCart(
            Long userId,
            AddToCartRequest request
    );

    CartResponse getCart(Long userId);
}