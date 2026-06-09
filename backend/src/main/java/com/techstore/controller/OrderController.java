package com.techstore.controller;

import com.techstore.dto.CreateOrderResponse;
import com.techstore.dto.OrderRequest;
import com.techstore.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.techstore.dto.OrderConfirmationResponse;
import com.techstore.dto.OrderHistoryDto;
import com.techstore.dto.OrderStatusUpdateRequest;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, Authentication authentication) {
        try {
            CreateOrderResponse response = orderService.createOrder(authentication.getName(), request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderConfirmationResponse> getOrderConfirmation(
            @PathVariable Long id,
            Authentication authentication
    ) {

        OrderConfirmationResponse response =
                orderService.getOrderConfirmation(
                        authentication.getName(),
                        id
                );

        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<OrderHistoryDto>>
    getOrderHistory(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                orderService.getOrderHistory(
                        authentication.getName()
                )
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        // Примітка: пізніше цей endpoint слід захистити для адміністратора
        // через @PreAuthorize("hasRole('ADMIN')") або в SecurityConfig
        try {
            orderService.updateOrderStatus(id, request.getStatus());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
