package com.uas.tutorias.service;

import com.uas.tutorias.entity.Materia;

import java.util.List;

public interface MateriaService {
    List<Materia> listarTodas();
    List<Materia> listarPorEstado(Boolean estado);
    List<Materia> listarPorPrograma(Long programaId);
    List<Materia> listarPorProgramaYSemestre(Long programaId, Integer semestre);
    Materia obtenerPorId(Long id);
    Materia crear(Materia materia);
    Materia actualizar(Long id, Materia datos);
    void eliminar(Long id);
}
