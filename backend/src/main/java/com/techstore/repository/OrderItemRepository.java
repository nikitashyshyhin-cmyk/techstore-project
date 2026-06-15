package com.techstore.repository;

import com.techstore.entity.OrderItem;
import com.techstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
        SELECT p
        FROM OrderItem oi
        JOIN oi.product p
        JOIN oi.order o
        WHERE o.createdAt >= :weekAgo
        GROUP BY p
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<Product> findPopularProducts(
            LocalDateTime weekAgo
    );

    List<OrderItem> findByOrder_Id(
            Long orderId
    );
}