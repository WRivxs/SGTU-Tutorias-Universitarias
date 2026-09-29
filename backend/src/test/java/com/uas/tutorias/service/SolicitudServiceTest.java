package com.uas.tutorias.service;

import com.uas.tutorias.entity.Solicitud;
import com.uas.tutorias.entity.Tutoria;
import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.BadRequestException;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.repository.SolicitudRepository;
import com.uas.tutorias.repository.TutoriaRepository;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.service.impl.SolicitudServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolicitudServiceTest {

    @Mock
    private SolicitudRepository solicitudRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private TutoriaRepository tutoriaRepository;

    @InjectMocks
    private SolicitudServiceImpl solicitudService;

    private Usuario estudiante;
    private Tutoria tutoria;
    private Solicitud solicitud;

    @BeforeEach
    void setUp() {
        estudiante = new Usuario();
        estudiante.setId(3L);
        estudiante.setNombre("Eduardo");
        estudiante.setRol(Usuario.Rol.ESTUDIANTE);

        tutoria = new Tutoria();
        tutoria.setId(10L);
        tutoria.setEstado(Tutoria.Estado.DISPONIBLE);

        solicitud = new Solicitud();
        solicitud.setId(100L);
        solicitud.setEstudiante(estudiante);
        solicitud.setTutoria(tutoria);
        solicitud.setEstado(Solicitud.Estado.PENDIENTE);
    }

    @Test
    @DisplayName("Debe crear solicitud exitosamente cuando estudiante y tutoria son válidos")
    void crear_SolicitudValida_GuardaSolicitud() {
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(estudiante));
        when(tutoriaRepository.findById(10L)).thenReturn(Optional.of(tutoria));
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        Solicitud resultado = solicitudService.crear(solicitud);

        assertNotNull(resultado);
        assertEquals(Solicitud.Estado.PENDIENTE, resultado.getEstado());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    @DisplayName("Debe lanzar BadRequestException si el usuario no tiene rol ESTUDIANTE")
    void crear_UsuarioNoEsEstudiante_LanzaBadRequestException() {
        estudiante.setRol(Usuario.Rol.TUTOR);
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(estudiante));

        assertThrows(BadRequestException.class, () -> solicitudService.crear(solicitud));
        verify(solicitudRepository, never()).save(any(Solicitud.class));
    }

    @Test
    @DisplayName("Debe lanzar ConflictException si la tutoría no está DISPONIBLE")
    void crear_TutoriaNoDisponible_LanzaConflictException() {
        tutoria.setEstado(Tutoria.Estado.OCUPADA);
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(estudiante));
        when(tutoriaRepository.findById(10L)).thenReturn(Optional.of(tutoria));

        assertThrows(ConflictException.class, () -> solicitudService.crear(solicitud));
        verify(solicitudRepository, never()).save(any(Solicitud.class));
    }

    @Test
    @DisplayName("Debe cambiar estado de tutoría a OCUPADA al ACEPTAR una solicitud")
    void cambiarEstado_AceptarSolicitud_ActualizaTutoriaA_Ocupada() {
        when(solicitudRepository.findById(100L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        Solicitud resultado = solicitudService.cambiarEstado(100L, Solicitud.Estado.ACEPTADA, "Aprobada");

        assertNotNull(resultado);
        assertEquals(Solicitud.Estado.ACEPTADA, resultado.getEstado());
        assertEquals(Tutoria.Estado.OCUPADA, tutoria.getEstado());
        verify(tutoriaRepository, times(1)).save(tutoria);
    }
}
