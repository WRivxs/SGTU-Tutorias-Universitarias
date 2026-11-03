package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.MateriaRepository;
import com.uas.tutorias.repository.ProgramaRepository;
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
    private final ProgramaRepository programaRepository;

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
    public List<Materia> listarPorPrograma(Long programaId) {
        return materiaRepository.findByProgramaId(programaId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Materia> listarPorProgramaYSemestre(Long programaId, Integer semestre) {
        return materiaRepository.findByProgramaIdAndSemestre(programaId, semestre);
    }

    @Override
    @Transactional(readOnly = true)
    public Materia obtenerPorId(Long id) {
        return materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + id));
    }

    @Override
    public Materia crear(Materia materia) {
        if (materia.getCodigo() != null && materiaRepository.existsByCodigo(materia.getCodigo())) {
            throw new ConflictException("Ya existe una materia con el código: " + materia.getCodigo());
        }
        if (materia.getPrograma() != null && materia.getPrograma().getId() != null) {
            materia.setPrograma(programaRepository.findById(materia.getPrograma().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado con id: " + materia.getPrograma().getId())));
        }
        return materiaRepository.save(materia);
    }

    @Override
    public Materia actualizar(Long id, Materia datos) {
        Materia materia = obtenerPorId(id);
        materia.setNombre(datos.getNombre());
        materia.setDescripcion(datos.getDescripcion());
        if (datos.getCodigo() != null && !datos.getCodigo().equals(materia.getCodigo())) {
            if (materiaRepository.existsByCodigo(datos.getCodigo())) {
                throw new ConflictException("Ya existe una materia con el código: " + datos.getCodigo());
            }
            materia.setCodigo(datos.getCodigo());
        }
        if (datos.getSemestre() != null) {
            materia.setSemestre(datos.getSemestre());
        }
        if (datos.getCreditos() != null) {
            materia.setCreditos(datos.getCreditos());
        }
        if (datos.getPrograma() != null && datos.getPrograma().getId() != null) {
            materia.setPrograma(programaRepository.findById(datos.getPrograma().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado con id: " + datos.getPrograma().getId())));
        }
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
