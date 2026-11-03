package com.uas.tutorias.service;

import com.uas.tutorias.entity.Facultad;

import java.util.List;

public interface FacultadService {
    List<Facultad> listarTodas();
    List<Facultad> listarPorEstado(Boolean estado);
    Facultad obtenerPorId(Long id);
    Facultad crear(Facultad facultad);
    Facultad actualizar(Long id, Facultad datos);
    void eliminar(Long id);
}
