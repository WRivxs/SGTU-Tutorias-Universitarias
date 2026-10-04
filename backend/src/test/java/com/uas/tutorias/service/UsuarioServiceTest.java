package com.uas.tutorias.service;

import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.service.impl.UsuarioServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        usuarioPrueba = new Usuario();
        usuarioPrueba.setId(1L);
        usuarioPrueba.setNombre("Wadid");
        usuarioPrueba.setApellido("Rivas");
        usuarioPrueba.setCorreo("wadid@tutorias.com");
        usuarioPrueba.setPassword("claveSegura123");
        usuarioPrueba.setRol(Usuario.Rol.TUTOR);
        usuarioPrueba.setEstado(true);
    }

    @Test
    @DisplayName("Debe listar todos los usuarios")
    void listarTodos_RetornaLista() {
        when(usuarioRepository.findAll()).thenReturn(List.of(usuarioPrueba));

        List<Usuario> resultado = usuarioService.listarTodos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Wadid", resultado.get(0).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe obtener un usuario por ID existente")
    void obtenerPorId_UsuarioExiste_RetornaUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioPrueba));

        Usuario resultado = usuarioService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals("wadid@tutorias.com", resultado.getCorreo());
    }

    @Test
    @DisplayName("Debe lanzar ResourceNotFoundException si el usuario no existe")
    void obtenerPorId_UsuarioNoExiste_LanzaExcepcion() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> usuarioService.obtenerPorId(99L));
    }

    @Test
    @DisplayName("Debe crear un usuario exitosamente si el correo no existe")
    void crear_CorreoNoExiste_GuardaUsuario() {
        when(usuarioRepository.existsByCorreo(usuarioPrueba.getCorreo())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("claveEncriptada");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        Usuario resultado = usuarioService.crear(usuarioPrueba);

        assertNotNull(resultado);
        assertEquals("wadid@tutorias.com", resultado.getCorreo());
        verify(usuarioRepository, times(1)).save(usuarioPrueba);
    }

    @Test
    @DisplayName("Debe lanzar ConflictException al intentar registrar un correo ya existente")
    void crear_CorreoYaExiste_LanzaConflictException() {
        when(usuarioRepository.existsByCorreo(usuarioPrueba.getCorreo())).thenReturn(true);

        assertThrows(ConflictException.class, () -> usuarioService.crear(usuarioPrueba));
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}
