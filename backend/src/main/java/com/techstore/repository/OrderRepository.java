package com.techstore.repository;

import com.techstore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByIdAndUser_Id(
            Long orderId,
            Long userId
    );
    
    List<Order> findByUser_IdOrderByCreatedAtDesc(
            Long userId
    );
}