package com.uas.tutorias.service.impl;

import com.uas.tutorias.dto.request.LoginRequest;
import com.uas.tutorias.dto.response.AuthResponse;
import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.BadRequestException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.security.JwtTokenProvider;
import com.uas.tutorias.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo: " + request.getCorreo()));

        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BadRequestException("La cuenta de usuario se encuentra inactiva. Contacte al administrador.");
        }

        String nombreCompleto = usuario.getNombre() + " " + usuario.getApellido();
        String token = jwtTokenProvider.generateToken(authentication, usuario.getId(), nombreCompleto);

        return AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol().name())
                .build();
    }
}
