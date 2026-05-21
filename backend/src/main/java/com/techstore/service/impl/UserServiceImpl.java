package com.techstore.service.impl;

import com.techstore.dto.UserResponse;
import com.techstore.entity.User;
import com.techstore.repository.UserRepository;
import com.techstore.service.UserService;
import com.techstore.dto.UserUpdateRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getEmail(),
                user.getName(),
                user.getPhone()
        );
    }

    @Override
    public UserResponse updateCurrentUser(UserUpdateRequest request) {
        // Отримуємо email авторизованого юзера
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // Валідація обов'язкового поля
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Email cannot be empty"
            );
        }

        // Перевірка унікальності нового email (якщо він відрізняється від поточного)
        if (!currentEmail.equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT, "Email already taken"
            );
        }

        // Шукаємо користувача в БД
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new com.techstore.exception.ResourceNotFoundException("User not found"));

        // Оновлюємо дані з DTO
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPhone(request.getPhone());

        // Зберігаємо оновленого користувача в базу
        User updatedUser = userRepository.save(user);

        // Повертаємо ваш оригінальний UserResponse(email, name, phone)
        return new UserResponse(updatedUser.getEmail(), updatedUser.getName(), updatedUser.getPhone());
    }
}