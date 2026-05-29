package com.techstore.controller;

import com.techstore.dto.AddToCartRequest;
import com.techstore.dto.CartItemResponse;
import com.techstore.service.CartService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(
            CartService cartService
    ) {
        this.cartService = cartService;
    }

    @PostMapping("/items")
    public CartItemResponse addToCart(
            @RequestBody AddToCartRequest request,
            HttpServletRequest httpRequest
    ) {

        Long userId = extractUserId(httpRequest);

        return cartService.addToCart(
                userId,
                request
        );
    }

    private Long extractUserId(
            HttpServletRequest request
    ) {

        String userIdHeader =
                request.getHeader("X-User-Id");

        if (userIdHeader == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        return Long.parseLong(userIdHeader);
    }
}