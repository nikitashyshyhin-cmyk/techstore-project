package com.techstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequest {

    @NotBlank(message = "Поточний пароль обов'язковий")
    private String currentPassword;

    @NotBlank(message = "Новий пароль обов'язковий")
    @Size(min = 6, message = "Новий пароль має бути не менше 6 символів")
    private String newPassword;

    @NotBlank(message = "Підтвердження пароля обов'язкове")
    private String confirmPassword;

    // Конструктори
    public ChangePasswordRequest() {}

    public ChangePasswordRequest(String currentPassword, String newPassword, String confirmPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    // Геттери та Сеттери
    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}