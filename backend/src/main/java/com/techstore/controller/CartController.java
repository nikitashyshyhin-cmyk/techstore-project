package com.techstore.controller;

import com.techstore.dto.AddToCartRequest;
import com.techstore.dto.AddToCartResponse;
import com.techstore.dto.CartResponse;

import com.techstore.exception.UnauthorizedException;

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
    public AddToCartResponse addToCart(
            @RequestBody AddToCartRequest request,
            HttpServletRequest httpRequest
    ) {

        Long userId = extractUserId(httpRequest);

        return cartService.addToCart(
                userId,
                request
        );
    }

    @GetMapping
    public CartResponse getCart(
            HttpServletRequest httpRequest
    ) {

        Long userId = extractUserId(httpRequest);

        return cartService.getCart(userId);
    }

    private Long extractUserId(
            HttpServletRequest request
    ) {

        String userIdHeader =
                request.getHeader("X-User-Id");

        if (
                userIdHeader == null ||
                userIdHeader.isBlank()
        ) {

            throw new UnauthorizedException(
                    "Missing X-User-Id header"
            );
        }

        try {

            return Long.parseLong(userIdHeader);

        } catch (NumberFormatException ex) {

            throw new UnauthorizedException(
                    "Invalid X-User-Id header"
            );
        }
    }
}