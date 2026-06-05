package com.techstore.repository;

import com.techstore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByIdAndUser_Id(
            Long orderId,
            Long userId
    );
}