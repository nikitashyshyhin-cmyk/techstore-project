package com.techstore.service;

import com.techstore.dto.UserResponse;
import com.techstore.dto.UserUpdateRequest;

public interface UserService {

    UserResponse getCurrentUser();

    UserResponse updateCurrentUser(UserUpdateRequest request);
}