package com.techstore.controller;

import com.techstore.dto.CartResponse;
import com.techstore.dto.CheckoutResponse;
import com.techstore.entity.User;
import com.techstore.exception.UnauthorizedException;
import com.techstore.repository.UserRepository;
import com.techstore.service.CartService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:5173")
public class CheckoutController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CheckoutController(
            CartService cartService,
            UserRepository userRepository
    ) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public CheckoutResponse getCheckoutDetails(Authentication authentication) {

        // 1. Отримуємо email користувача з токена
        String email = authentication.getName();

        // 2. Шукаємо користувача, якщо немає - кидаємо 401 Unauthorized
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UnauthorizedException("User not found")
                );

        // 3. Отримуємо актуальний кошик з розрахунками
        CartResponse cart = cartService.getCart(user.getId());

        // 4. Формуємо CheckoutResponse, щоб не віддавати напряму сутності
        CheckoutResponse response = new CheckoutResponse();
        response.setItems(cart.getItems());
        response.setTotal(cart.getTotalCartPrice());

        return response;
    }
}
