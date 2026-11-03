package com.uas.tutorias.service;

import com.uas.tutorias.entity.Docente;

import java.util.List;
import java.util.Set;

public interface DocenteService {
    List<Docente> listarTodos();
    Docente obtenerPorId(Long id);
    Docente obtenerPorUsuarioId(Long usuarioId);
    Docente crear(Docente docente);
    Docente actualizar(Long id, Docente datos);
    Docente asignarMaterias(Long docenteId, Set<Long> materiasIds);
    Docente removerMateria(Long docenteId, Long materiaId);
    void eliminar(Long id);
}
