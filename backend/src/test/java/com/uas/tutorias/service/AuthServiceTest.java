package com.uas.tutorias.service;

import com.uas.tutorias.dto.request.LoginRequest;
import com.uas.tutorias.dto.response.AuthResponse;
import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.BadRequestException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.security.JwtTokenProvider;
import com.uas.tutorias.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UsuarioRepository usuarioRepository;

    private AuthServiceImpl authService;

    private Usuario usuarioPrueba;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(
                "SGTUTutoriasUniversitariasSecretKey2026SecureHashKeyMustBeLongEnoughForHS256Algorithm",
                86400000L
        );
        authService = new AuthServiceImpl(authenticationManager, jwtTokenProvider, usuarioRepository);

        usuarioPrueba = new Usuario();
        usuarioPrueba.setId(1L);
        usuarioPrueba.setNombre("Admin");
        usuarioPrueba.setApellido("Sistema");
        usuarioPrueba.setCorreo("admin@tutorias.com");
        usuarioPrueba.setPassword("$2a$10$encodedPassword");
        usuarioPrueba.setRol(Usuario.Rol.ADMINISTRADOR);
        usuarioPrueba.setEstado(true);

        loginRequest = new LoginRequest("admin@tutorias.com", "Admin123*");
    }

    @Test
    @DisplayName("Debe autenticar exitosamente y retornar token JWT")
    void login_CredencialesValidas_RetornaAuthResponse() {
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(usuarioRepository.findByCorreo("admin@tutorias.com")).thenReturn(Optional.of(usuarioPrueba));

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(response.getToken().length() > 20);
        assertEquals("ADMINISTRADOR", response.getRol());
        assertEquals("admin@tutorias.com", response.getCorreo());
        verify(authenticationManager, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Debe lanzar ResourceNotFoundException si el usuario no existe")
    void login_UsuarioNoExiste_LanzaException() {
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(usuarioRepository.findByCorreo("admin@tutorias.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authService.login(loginRequest));
    }

    @Test
    @DisplayName("Debe lanzar BadRequestException si el usuario se encuentra inactivo")
    void login_UsuarioInactivo_LanzaException() {
        usuarioPrueba.setEstado(false);
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(usuarioRepository.findByCorreo("admin@tutorias.com")).thenReturn(Optional.of(usuarioPrueba));

        assertThrows(BadRequestException.class, () -> authService.login(loginRequest));
    }
}
