package com.uas.tutorias.service;

import com.uas.tutorias.entity.Tutoria;

import java.util.List;

public interface TutoriaService {
    List<Tutoria> listarTodas();
    List<Tutoria> listarPorEstado(Tutoria.Estado estado);
    List<Tutoria> listarPorMateria(Long materiaId);
    Tutoria obtenerPorId(Long id);
    Tutoria crear(Tutoria tutoria);
    Tutoria actualizar(Long id, Tutoria datos);
    Tutoria cambiarEstado(Long id, Tutoria.Estado nuevoEstado);
    void eliminar(Long id);
}
