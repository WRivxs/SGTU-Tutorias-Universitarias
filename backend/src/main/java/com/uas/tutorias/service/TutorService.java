package com.uas.tutorias.service;

import com.uas.tutorias.entity.Tutor;

import java.util.List;

public interface TutorService {
    List<Tutor> listarTodos();
    Tutor obtenerPorId(Long id);
    Tutor obtenerPorUsuarioId(Long usuarioId);
    Tutor crear(Tutor tutor);
    Tutor actualizar(Long id, Tutor datos);
    void eliminar(Long id);
}
