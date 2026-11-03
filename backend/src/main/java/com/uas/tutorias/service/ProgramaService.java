package com.uas.tutorias.service;

import com.uas.tutorias.entity.Programa;

import java.util.List;

public interface ProgramaService {
    List<Programa> listarTodos();
    List<Programa> listarPorEstado(Boolean estado);
    List<Programa> listarPorFacultad(Long facultadId);
    Programa obtenerPorId(Long id);
    Programa crear(Programa programa);
    Programa actualizar(Long id, Programa datos);
    void eliminar(Long id);
}
