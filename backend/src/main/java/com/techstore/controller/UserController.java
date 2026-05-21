package com.techstore.controller;

import com.techstore.dto.ChangePasswordRequest;
import com.techstore.dto.UserResponse;
import com.techstore.service.UserService;
import com.techstore.dto.UserUpdateRequest;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }

    // Новий метод PUT для оновлення профілю
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(@RequestBody UserUpdateRequest request) {
        UserResponse updatedUser = userService.updateCurrentUser(request);
        return ResponseEntity.ok(updatedUser);
    }

    // 3. Твій новий метод для зміни пароля (US 2.3)
    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request, Principal principal) {
        String email = principal.getName();
        userService.changePassword(email, request);
        return ResponseEntity.ok(Map.of("message", "Пароль успішно оновлено"));
    }
}