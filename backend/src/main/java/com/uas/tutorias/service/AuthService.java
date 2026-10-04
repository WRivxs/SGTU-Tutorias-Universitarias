package com.uas.tutorias.service;

import com.uas.tutorias.dto.request.LoginRequest;
import com.uas.tutorias.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
