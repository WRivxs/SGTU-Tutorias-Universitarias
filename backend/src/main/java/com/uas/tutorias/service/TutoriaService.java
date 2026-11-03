package com.uas.tutorias.service;

import com.uas.tutorias.entity.Tutoria;

import java.util.List;

public interface TutoriaService {
    List<Tutoria> listarTodas();
    List<Tutoria> listarPorEstado(Tutoria.Estado estado);
    List<Tutoria> listarPorMateria(Long materiaId);
    List<Tutoria> listarPorDocente(Long docenteId);
    List<Tutoria> listarPorPrograma(Long programaId);
    List<Tutoria> listarPorProgramaYSemestre(Long programaId, Integer semestre);
    List<Tutoria> listarConFiltros(Long programaId, Integer semestre, Long materiaId, Long docenteId, Tutoria.Estado estado);
    Tutoria obtenerPorId(Long id);
    Tutoria crear(Tutoria tutoria);
    Tutoria actualizar(Long id, Tutoria datos);
    Tutoria cambiarEstado(Long id, Tutoria.Estado nuevoEstado);
    void eliminar(Long id);
}
