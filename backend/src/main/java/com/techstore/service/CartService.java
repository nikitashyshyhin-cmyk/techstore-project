package com.techstore.service;

import com.techstore.dto.AddToCartRequest;
import com.techstore.dto.CartItemResponse;

public interface CartService {

    CartItemResponse addToCart(
            Long userId,
            AddToCartRequest request
    );
}