package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Facultad;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.FacultadRepository;
import com.uas.tutorias.service.FacultadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FacultadServiceImpl implements FacultadService {

    private final FacultadRepository facultadRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Facultad> listarTodas() {
        return facultadRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Facultad> listarPorEstado(Boolean estado) {
        return facultadRepository.findByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public Facultad obtenerPorId(Long id) {
        return facultadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con id: " + id));
    }

    @Override
    public Facultad crear(Facultad facultad) {
        if (facultadRepository.existsByCodigo(facultad.getCodigo())) {
            throw new ConflictException("Ya existe una facultad con el código: " + facultad.getCodigo());
        }
        if (facultadRepository.existsByNombre(facultad.getNombre())) {
            throw new ConflictException("Ya existe una facultad con el nombre: " + facultad.getNombre());
        }
        return facultadRepository.save(facultad);
    }

    @Override
    public Facultad actualizar(Long id, Facultad datos) {
        Facultad facultad = obtenerPorId(id);
        if (datos.getCodigo() != null && !datos.getCodigo().equals(facultad.getCodigo())) {
            if (facultadRepository.existsByCodigo(datos.getCodigo())) {
                throw new ConflictException("Ya existe una facultad con el código: " + datos.getCodigo());
            }
            facultad.setCodigo(datos.getCodigo());
        }
        if (datos.getNombre() != null && !datos.getNombre().equals(facultad.getNombre())) {
            if (facultadRepository.existsByNombre(datos.getNombre())) {
                throw new ConflictException("Ya existe una facultad con el nombre: " + datos.getNombre());
            }
            facultad.setNombre(datos.getNombre());
        }
        facultad.setDescripcion(datos.getDescripcion());
        if (datos.getEstado() != null) {
            facultad.setEstado(datos.getEstado());
        }
        return facultadRepository.save(facultad);
    }

    @Override
    public void eliminar(Long id) {
        Facultad facultad = obtenerPorId(id);
        facultadRepository.delete(facultad);
    }
}
