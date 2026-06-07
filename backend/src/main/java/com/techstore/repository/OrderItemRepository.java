package com.techstore.repository;

import com.techstore.dto.PopularProductDto;
import com.techstore.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
        SELECT new com.techstore.dto.PopularProductDto(
            p.id,
            p.name,
            p.price,
            p.imageUrl
        )
        FROM OrderItem oi
        JOIN oi.product p
        WHERE oi.order.createdAt >= :weekAgo
        GROUP BY p.id, p.name, p.price, p.imageUrl
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<PopularProductDto> findPopularProducts(
            LocalDateTime weekAgo
    );
}