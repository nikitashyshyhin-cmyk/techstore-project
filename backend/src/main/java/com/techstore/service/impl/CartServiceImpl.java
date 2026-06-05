package com.techstore.service.impl;

import com.techstore.dto.AddToCartRequest;
import com.techstore.dto.AddToCartResponse;
import com.techstore.dto.CartItemDto;
import com.techstore.dto.CartResponse;

import com.techstore.entity.CartItem;
import com.techstore.entity.Product;
import com.techstore.entity.User;

import com.techstore.exception.ResourceNotFoundException;
import com.techstore.exception.UnauthorizedException;

import com.techstore.repository.CartItemRepository;
import com.techstore.repository.ProductRepository;
import com.techstore.repository.UserRepository;

import com.techstore.service.CartService;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
    public AddToCartResponse addToCart(
            Long userId,
            AddToCartRequest request
    ) {

        validateAddToCartRequest(request);

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "User not authorized"
                        )
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

        return new AddToCartResponse(
                product.getId(),
                product.getName(),
                cartItem.getQuantity()
        );
    }

    @Override
    public CartResponse getCart(
            Long userId
    ) {

        List<CartItem> cartItems =
                cartItemRepository.findByUser_Id(userId);

        List<CartItemDto> itemDtos =
                new ArrayList<>();

        BigDecimal totalCartPrice =
                BigDecimal.ZERO;

        for (CartItem item : cartItems) {

            CartItemDto dto =
                    new CartItemDto();

            dto.setProductId(
                    item.getProduct().getId()
            );

            dto.setName(
                    item.getProduct().getName()
            );

            dto.setPrice(
                    item.getProduct().getPrice()
            );

            dto.setImageUrl(
                    item.getProduct().getImageUrl()
            );

            dto.setQuantity(
                    item.getQuantity()
            );

            BigDecimal subtotal =
                    item.getProduct()
                            .getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getQuantity()
                                    )
                            );

            dto.setSubtotal(subtotal);

            itemDtos.add(dto);

            totalCartPrice =
                    totalCartPrice.add(subtotal);
        }

        CartResponse response =
                new CartResponse();

        response.setItems(itemDtos);

        response.setTotalCartPrice(
                totalCartPrice
        );

        return response;
    }

    private void validateAddToCartRequest(
            AddToCartRequest request
    ) {

        if (request.getProductId() == null) {

            throw new IllegalArgumentException(
                    "Product ID is required"
            );
        }

        if (
                request.getQuantity() == null ||
                request.getQuantity() < 1
        ) {

            throw new IllegalArgumentException(
                    "Quantity must be at least 1"
            );
        }
    }

    @Override
    @Transactional
    public void clearCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Користувача не знайдено"));
        cartItemRepository.deleteByUserId(user.getId());
    }
}