package com.techstore.controller;

import com.techstore.dto.AuthResponse;
import com.techstore.dto.LoginRequest;
import com.techstore.dto.RegisterRequest;
import com.techstore.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            authService.register(request);
            return ResponseEntity.status(201).body("User created");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            String token = authService.login(request);
            // Повертаємо токен у нашому DTO (другий конструктор)
            return ResponseEntity.ok(new AuthResponse("Login successful", token));
        } catch (IllegalArgumentException e) {
            // Повертаємо 401 Unauthorized
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}