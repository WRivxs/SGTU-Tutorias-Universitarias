package com.uas.tutorias.service;

import com.uas.tutorias.entity.Estudiante;

import java.util.List;

public interface EstudianteService {
    List<Estudiante> listarTodos();
    List<Estudiante> listarPorPrograma(Long programaId);
    Estudiante obtenerPorId(Long id);
    Estudiante obtenerPorUsuarioId(Long usuarioId);
    Estudiante obtenerPorCodigo(String codigoEstudiantil);
    Estudiante crear(Estudiante estudiante);
    Estudiante actualizar(Long id, Estudiante datos);
    void eliminar(Long id);
}
