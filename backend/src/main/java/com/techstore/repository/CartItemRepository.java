package com.techstore.repository;

import com.techstore.entity.CartItem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByUser_IdAndProduct_Id(
            Long userId,
            Long productId
    );
}