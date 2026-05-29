package com.techstore.service.impl;

import com.techstore.dto.AddToCartRequest;
import com.techstore.dto.CartItemResponse;

import com.techstore.entity.CartItem;
import com.techstore.entity.Product;
import com.techstore.entity.User;

import com.techstore.exception.ResourceNotFoundException;

import com.techstore.repository.CartItemRepository;
import com.techstore.repository.ProductRepository;
import com.techstore.repository.UserRepository;

import com.techstore.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Autowired
    public CartServiceImpl(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CartItemResponse addToCart(
            Long userId,
            AddToCartRequest request
    ) {

        if (
                request.getQuantity() == null ||
                request.getQuantity() < 1
        ) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1"
            );
        }

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Unauthorized")
                );

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: "
                                        + request.getProductId()
                        )
                );

        CartItem cartItem = cartItemRepository
                .findByUser_IdAndProduct_Id(
                        userId,
                        request.getProductId()
                )
                .orElse(null);

        if (cartItem != null) {

            cartItem.setQuantity(
                    cartItem.getQuantity()
                            + request.getQuantity()
            );

        } else {

            cartItem = new CartItem(
                    user,
                    product,
                    request.getQuantity()
            );
        }

        cartItemRepository.save(cartItem);

        return new CartItemResponse(
                product.getId(),
                product.getName(),
                cartItem.getQuantity()
        );
    }
}