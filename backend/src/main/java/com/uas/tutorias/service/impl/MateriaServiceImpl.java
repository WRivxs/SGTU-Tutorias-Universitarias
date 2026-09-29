package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.MateriaRepository;
import com.uas.tutorias.service.MateriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MateriaServiceImpl implements MateriaService {

    private final MateriaRepository materiaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Materia> listarTodas() {
        return materiaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Materia> listarPorEstado(Boolean estado) {
        return materiaRepository.findByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public Materia obtenerPorId(Long id) {
        return materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + id));
    }

    @Override
    public Materia crear(Materia materia) {
        return materiaRepository.save(materia);
    }

    @Override
    public Materia actualizar(Long id, Materia datos) {
        Materia materia = obtenerPorId(id);
        materia.setNombre(datos.getNombre());
        materia.setDescripcion(datos.getDescripcion());
        if (datos.getEstado() != null) {
            materia.setEstado(datos.getEstado());
        }
        return materiaRepository.save(materia);
    }

    @Override
    public void eliminar(Long id) {
        Materia materia = obtenerPorId(id);
        materiaRepository.delete(materia);
    }
}
