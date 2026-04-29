package com.techstore.service;

import com.techstore.dto.LoginRequest;
import com.techstore.dto.RegisterRequest;
import com.techstore.entity.User;
import com.techstore.repository.UserRepository;
import com.techstore.security.JWTService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder, JWTService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) {

    	if (request.getEmail() == null || !request.getEmail().contains("@")) {
    	    throw new IllegalArgumentException("Invalid email");
    	}

    	if (request.getPassword().length() < 6) {
    	    throw new IllegalArgumentException("Password too short");
    	}

    	if (userRepository.findByEmail(request.getEmail()).isPresent()) {
    	    throw new IllegalStateException("Email already exists");
    	}

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
    }

    public String login(LoginRequest request) {
        // 1. Знайти користувача
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // 2. Перевірити пароль (matches повертає true/false)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // 3. Згенерувати JWT
        return jwtService.generateToken(user.getEmail());
    }
}