package com.uas.tutorias.service;

import com.uas.tutorias.entity.Estudiante;
import com.uas.tutorias.entity.Programa;
import com.uas.tutorias.entity.Solicitud;
import com.uas.tutorias.entity.Tutoria;
import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.repository.EstudianteRepository;
import com.uas.tutorias.repository.SolicitudRepository;
import com.uas.tutorias.repository.TutoriaRepository;
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
    private EstudianteRepository estudianteRepository;

    @Mock
    private TutoriaRepository tutoriaRepository;

    @InjectMocks
    private SolicitudServiceImpl solicitudService;

    private Usuario usuario;
    private Estudiante estudiante;
    private Tutoria tutoria;
    private Solicitud solicitud;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(3L);
        usuario.setNombre("Eduardo");
        usuario.setRol(Usuario.Rol.ESTUDIANTE);

        Programa programa = new Programa();
        programa.setId(1L);
        programa.setNombre("Ingeniería de Sistemas");

        estudiante = new Estudiante();
        estudiante.setId(1L);
        estudiante.setUsuario(usuario);
        estudiante.setPrograma(programa);
        estudiante.setSemestreActual(5);
        estudiante.setCodigoEstudiantil("SIS-2022-0145");

        tutoria = new Tutoria();
        tutoria.setId(10L);
        tutoria.setCupoMaximo(5);
        tutoria.setEstado(Tutoria.Estado.DISPONIBLE);

        solicitud = new Solicitud();
        solicitud.setId(100L);
        solicitud.setEstudiante(estudiante);
        solicitud.setTutoria(tutoria);
        solicitud.setEstado(Solicitud.Estado.PENDIENTE);
    }

    @Test
    @DisplayName("Debe crear solicitud exitosamente cuando estudiante y tutoría son válidos")
    void crear_SolicitudValida_GuardaSolicitud() {
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        when(tutoriaRepository.findById(10L)).thenReturn(Optional.of(tutoria));
        when(solicitudRepository.existsByEstudianteIdAndTutoriaId(1L, 10L)).thenReturn(false);
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        Solicitud resultado = solicitudService.crear(solicitud);

        assertNotNull(resultado);
        assertEquals(Solicitud.Estado.PENDIENTE, resultado.getEstado());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    @DisplayName("Debe lanzar ConflictException si el estudiante ya tiene una solicitud para la misma tutoría")
    void crear_SolicitudDuplicada_LanzaConflictException() {
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        when(tutoriaRepository.findById(10L)).thenReturn(Optional.of(tutoria));
        when(solicitudRepository.existsByEstudianteIdAndTutoriaId(1L, 10L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> solicitudService.crear(solicitud));
        verify(solicitudRepository, never()).save(any(Solicitud.class));
    }

    @Test
    @DisplayName("Debe lanzar ConflictException si la tutoría no está DISPONIBLE")
    void crear_TutoriaNoDisponible_LanzaConflictException() {
        tutoria.setEstado(Tutoria.Estado.OCUPADA);
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        when(tutoriaRepository.findById(10L)).thenReturn(Optional.of(tutoria));

        assertThrows(ConflictException.class, () -> solicitudService.crear(solicitud));
        verify(solicitudRepository, never()).save(any(Solicitud.class));
    }

    @Test
    @DisplayName("Debe responder a una solicitud actualizando su estado")
    void cambiarEstado_AceptarSolicitud_ActualizaEstado() {
        when(solicitudRepository.findById(100L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        Solicitud resultado = solicitudService.cambiarEstado(100L, Solicitud.Estado.ACEPTADA, "Aprobada");

        assertNotNull(resultado);
        assertEquals(Solicitud.Estado.ACEPTADA, resultado.getEstado());
        assertEquals("Aprobada", resultado.getComentario());
        verify(solicitudRepository, times(1)).save(solicitud);
    }
}
