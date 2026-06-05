package com.techstore.service;

import com.techstore.dto.CartItemDto;
import com.techstore.dto.CartResponse;
import com.techstore.dto.CreateOrderResponse;
import com.techstore.dto.OrderRequest;
import com.techstore.entity.Order;
import com.techstore.entity.OrderItem;
import com.techstore.entity.Product;
import com.techstore.entity.User;
import com.techstore.exception.ResourceNotFoundException;
import com.techstore.repository.OrderItemRepository;
import com.techstore.repository.OrderRepository;
import com.techstore.repository.ProductRepository;
import com.techstore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.techstore.dto.OrderConfirmationResponse;
import org.springframework.security.access.AccessDeniedException;


@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        CartService cartService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartService = cartService;
    }

    @Transactional
    public CreateOrderResponse createOrder(String email, OrderRequest request) {
        // 1. Знаходимо користувача за email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Користувача не знайдено"));
        // 2. Отримуємо товари з кошика
        CartResponse cart = cartService.getCart(user.getId());

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Кошик порожній");
        }

        // 3. Створюємо та зберігаємо головне замовлення
        Order order = new Order(
                user,
                request.getDeliveryAddress(),
                request.getPaymentMethod(),
                request.getComment(),
                cart.getTotalCartPrice()
        );

        Order savedOrder = orderRepository.save(order);

        // 4. Переносимо товари з кошика в замовлення
        for (CartItemDto itemDto : cart.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Товар не знайдено"));

            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    product,
                    itemDto.getQuantity(),
                    itemDto.getPrice(),
                    itemDto.getSubtotal()
            );
            orderItemRepository.save(orderItem);
        }

        // 5. Очищаємо кошик
        cartService.clearCart(email);

        return new CreateOrderResponse(savedOrder.getId(), savedOrder.getTotal(), savedOrder.getStatus());
    }
    
    @Transactional(readOnly = true)
    public OrderConfirmationResponse getOrderConfirmation(
            String email,
            Long orderId
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Користувача не знайдено")
                );

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Замовлення не знайдено")
                );

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException(
                    "Доступ до чужого замовлення заборонений"
            );
        }

        return new OrderConfirmationResponse(
                order.getTotal(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getDeliveryAddress(),
                order.getPaymentMethod()
        );
    }
}
