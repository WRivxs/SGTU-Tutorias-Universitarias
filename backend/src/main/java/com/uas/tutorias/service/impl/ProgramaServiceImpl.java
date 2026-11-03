package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Programa;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.FacultadRepository;
import com.uas.tutorias.repository.ProgramaRepository;
import com.uas.tutorias.service.ProgramaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgramaServiceImpl implements ProgramaService {

    private final ProgramaRepository programaRepository;
    private final FacultadRepository facultadRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Programa> listarTodos() {
        return programaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Programa> listarPorEstado(Boolean estado) {
        return programaRepository.findByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Programa> listarPorFacultad(Long facultadId) {
        return programaRepository.findByFacultadId(facultadId);
    }

    @Override
    @Transactional(readOnly = true)
    public Programa obtenerPorId(Long id) {
        return programaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado con id: " + id));
    }

    @Override
    public Programa crear(Programa programa) {
        if (programaRepository.existsByCodigo(programa.getCodigo())) {
            throw new ConflictException("Ya existe un programa con el código: " + programa.getCodigo());
        }
        if (programa.getFacultad() != null && programa.getFacultad().getId() != null) {
            programa.setFacultad(facultadRepository.findById(programa.getFacultad().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con id: " + programa.getFacultad().getId())));
        }
        return programaRepository.save(programa);
    }

    @Override
    public Programa actualizar(Long id, Programa datos) {
        Programa programa = obtenerPorId(id);
        if (datos.getCodigo() != null && !datos.getCodigo().equals(programa.getCodigo())) {
            if (programaRepository.existsByCodigo(datos.getCodigo())) {
                throw new ConflictException("Ya existe un programa con el código: " + datos.getCodigo());
            }
            programa.setCodigo(datos.getCodigo());
        }
        programa.setNombre(datos.getNombre());
        programa.setDescripcion(datos.getDescripcion());
        if (datos.getFacultad() != null && datos.getFacultad().getId() != null) {
            programa.setFacultad(facultadRepository.findById(datos.getFacultad().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con id: " + datos.getFacultad().getId())));
        }
        if (datos.getEstado() != null) {
            programa.setEstado(datos.getEstado());
        }
        return programaRepository.save(programa);
    }

    @Override
    public void eliminar(Long id) {
        Programa programa = obtenerPorId(id);
        programaRepository.delete(programa);
    }
}
