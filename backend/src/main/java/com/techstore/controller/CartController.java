package com.techstore.controller;

import com.techstore.dto.AddToCartRequest;
import com.techstore.dto.AddToCartResponse;
import com.techstore.dto.CartResponse;
import com.techstore.entity.User;
import com.techstore.exception.UnauthorizedException;
import com.techstore.repository.UserRepository;
import com.techstore.service.CartService;
import com.techstore.dto.CartItemUpdateRequest;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(
            CartService cartService,
            UserRepository userRepository
    ) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @PostMapping("/items")
    public AddToCartResponse addToCart(
            @RequestBody AddToCartRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UnauthorizedException("User not found")
                );

        return cartService.addToCart(user.getId(), request);
    }

    @GetMapping
    public CartResponse getCart(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UnauthorizedException("User not found")
                );

        return cartService.getCart(user.getId());
    }
    
    @DeleteMapping("/items/{id}")
    public CartResponse removeCartItem(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new UnauthorizedException(
                                        "User not found"
                                )
                        );

        return cartService.removeCartItem(
                user.getId(),
                id
        );
    }
    
    @PatchMapping("/items/{id}")
    public CartResponse updateCartItemQuantity(
            @PathVariable Long id,
            @RequestBody CartItemUpdateRequest request,
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new UnauthorizedException(
                                        "User not found"
                                )
                        );

        return cartService
                .updateCartItemQuantity(
                        user.getId(),
                        id,
                        request.getQuantity()
                );
    }
}