package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo: " + correo));
    }

    @Override
    public Usuario crear(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new ConflictException("Ya existe un usuario registrado con el correo: " + usuario.getCorreo());
        }
        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario actualizar(Long id, Usuario datos) {
        Usuario usuario = obtenerPorId(id);

        if (!usuario.getCorreo().equalsIgnoreCase(datos.getCorreo())
                && usuarioRepository.existsByCorreo(datos.getCorreo())) {
            throw new ConflictException("El correo " + datos.getCorreo() + " ya está en uso por otro usuario");
        }

        usuario.setNombre(datos.getNombre());
        usuario.setApellido(datos.getApellido());
        usuario.setCorreo(datos.getCorreo());
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(datos.getPassword()));
        }
        if (datos.getRol() != null) {
            usuario.setRol(datos.getRol());
        }
        if (datos.getEstado() != null) {
            usuario.setEstado(datos.getEstado());
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario cambiarEstado(Long id, Boolean estado) {
        Usuario usuario = obtenerPorId(id);
        usuario.setEstado(estado);
        return usuarioRepository.save(usuario);
    }

    @Override
    public void eliminar(Long id) {
        Usuario usuario = obtenerPorId(id);
        usuarioRepository.delete(usuario);
    }
}
