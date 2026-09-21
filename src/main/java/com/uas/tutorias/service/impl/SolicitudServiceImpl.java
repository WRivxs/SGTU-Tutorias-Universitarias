package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Solicitud;
import com.uas.tutorias.entity.Tutoria;
import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.BadRequestException;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.SolicitudRepository;
import com.uas.tutorias.repository.TutoriaRepository;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.service.SolicitudService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final UsuarioRepository usuarioRepository;
    private final TutoriaRepository tutoriaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Solicitud> listarTodas() {
        return solicitudRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Solicitud> listarPorEstudiante(Long estudianteId) {
        return solicitudRepository.findByEstudianteId(estudianteId);
    }

    @Override
    @Transactional(readOnly = true)
    public Solicitud obtenerPorId(Long id) {
        return solicitudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con id: " + id));
    }

    @Override
    public Solicitud crear(Solicitud solicitud) {
        if (solicitud.getEstudiante() == null || solicitud.getEstudiante().getId() == null) {
            throw new BadRequestException("Debe indicar el estudiante solicitante");
        }
        if (solicitud.getTutoria() == null || solicitud.getTutoria().getId() == null) {
            throw new BadRequestException("Debe indicar la tutoría que se desea solicitar");
        }

        Long estudianteId = solicitud.getEstudiante().getId();
        Usuario estudiante = usuarioRepository.findById(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con id: " + estudianteId));

        if (estudiante.getRol() != Usuario.Rol.ESTUDIANTE) {
            throw new BadRequestException("El usuario solicitante debe tener el rol ESTUDIANTE. Rol actual: " + estudiante.getRol());
        }

        Long tutoriaId = solicitud.getTutoria().getId();
        Tutoria tutoria = tutoriaRepository.findById(tutoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoría no encontrada con id: " + tutoriaId));

        if (tutoria.getEstado() != Tutoria.Estado.DISPONIBLE) {
            throw new ConflictException("La tutoría no está disponible para solicitudes. Estado actual: " + tutoria.getEstado());
        }

        solicitud.setEstudiante(estudiante);
        solicitud.setTutoria(tutoria);
        if (solicitud.getEstado() == null) {
            solicitud.setEstado(Solicitud.Estado.PENDIENTE);
        }

        return solicitudRepository.save(solicitud);
    }

    @Override
    public Solicitud actualizar(Long id, Solicitud datos) {
        Solicitud solicitud = obtenerPorId(id);

        if (datos.getEstado() != null) {
            cambiarEstadoInterno(solicitud, datos.getEstado(), datos.getComentario());
        } else if (datos.getComentario() != null) {
            solicitud.setComentario(datos.getComentario());
        }

        return solicitudRepository.save(solicitud);
    }

    @Override
    public Solicitud cambiarEstado(Long id, Solicitud.Estado nuevoEstado, String comentario) {
        Solicitud solicitud = obtenerPorId(id);
        cambiarEstadoInterno(solicitud, nuevoEstado, comentario);
        return solicitudRepository.save(solicitud);
    }

    private void cambiarEstadoInterno(Solicitud solicitud, Solicitud.Estado nuevoEstado, String comentario) {
        solicitud.setEstado(nuevoEstado);
        if (comentario != null) {
            solicitud.setComentario(comentario);
        }

        Tutoria tutoria = solicitud.getTutoria();
        if (tutoria != null) {
            if (nuevoEstado == Solicitud.Estado.ACEPTADA) {
                tutoria.setEstado(Tutoria.Estado.OCUPADA);
                tutoriaRepository.save(tutoria);
            } else if (nuevoEstado == Solicitud.Estado.CANCELADA || nuevoEstado == Solicitud.Estado.RECHAZADA) {
                if (tutoria.getEstado() == Tutoria.Estado.OCUPADA) {
                    tutoria.setEstado(Tutoria.Estado.DISPONIBLE);
                    tutoriaRepository.save(tutoria);
                }
            }
        }
    }

    @Override
    public void eliminar(Long id) {
        Solicitud solicitud = obtenerPorId(id);
        solicitudRepository.delete(solicitud);
    }
}
