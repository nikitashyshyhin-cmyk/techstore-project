package com.techstore.service;

import com.techstore.dto.RegisterRequest;
import com.techstore.entity.User;
import com.techstore.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
}