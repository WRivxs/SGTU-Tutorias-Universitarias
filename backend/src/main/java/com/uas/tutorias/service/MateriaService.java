package com.uas.tutorias.service;

import com.uas.tutorias.entity.Materia;

import java.util.List;

public interface MateriaService {
    List<Materia> listarTodas();
    List<Materia> listarPorEstado(Boolean estado);
    Materia obtenerPorId(Long id);
    Materia crear(Materia materia);
    Materia actualizar(Long id, Materia datos);
    void eliminar(Long id);
}
