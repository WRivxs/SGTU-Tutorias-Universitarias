package com.uas.tutorias.service;

import com.uas.tutorias.entity.Solicitud;

import java.util.List;

public interface SolicitudService {
    List<Solicitud> listarTodas();
    List<Solicitud> listarPorEstudiante(Long estudianteId);
    Solicitud obtenerPorId(Long id);
    Solicitud crear(Solicitud solicitud);
    Solicitud actualizar(Long id, Solicitud datos);
    Solicitud cambiarEstado(Long id, Solicitud.Estado nuevoEstado, String comentario);
    void eliminar(Long id);
}
