package com.techstore.controller;

import com.techstore.dto.UserResponse;
import com.techstore.service.UserService;
import com.techstore.dto.UserUpdateRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

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
}