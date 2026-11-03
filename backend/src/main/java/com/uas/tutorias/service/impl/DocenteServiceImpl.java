package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Docente;
import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.DocenteRepository;
import com.uas.tutorias.repository.MateriaRepository;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.service.DocenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class DocenteServiceImpl implements DocenteService {

    private final DocenteRepository docenteRepository;
    private final UsuarioRepository usuarioRepository;
    private final MateriaRepository materiaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Docente> listarTodos() {
        return docenteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Docente obtenerPorId(Long id) {
        return docenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado con id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Docente obtenerPorUsuarioId(Long usuarioId) {
        return docenteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado para el usuario con id: " + usuarioId));
    }

    @Override
    public Docente crear(Docente docente) {
        Long usuarioId = docente.getUsuario().getId();
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId));

        if (usuario.getRol() != Usuario.Rol.DOCENTE) {
            throw new ConflictException("El usuario debe tener rol DOCENTE para asignarle un perfil");
        }

        if (docenteRepository.existsByUsuarioId(usuarioId)) {
            throw new ConflictException("Ya existe un perfil de docente para el usuario con id: " + usuarioId);
        }

        docente.setUsuario(usuario);

        // Si se enviaron materias, cargarlas
        if (docente.getMaterias() != null && !docente.getMaterias().isEmpty()) {
            Set<Materia> materiasCargadas = new HashSet<>();
            for (Materia m : docente.getMaterias()) {
                if (m.getId() != null) {
                    materiasCargadas.add(materiaRepository.findById(m.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + m.getId())));
                }
            }
            docente.setMaterias(materiasCargadas);
        }

        return docenteRepository.save(docente);
    }

    @Override
    public Docente actualizar(Long id, Docente datos) {
        Docente docente = obtenerPorId(id);
        docente.setEspecialidad(datos.getEspecialidad());
        docente.setDescripcion(datos.getDescripcion());
        docente.setDisponibilidad(datos.getDisponibilidad());
        return docenteRepository.save(docente);
    }

    @Override
    public Docente asignarMaterias(Long docenteId, Set<Long> materiasIds) {
        Docente docente = obtenerPorId(docenteId);
        Set<Materia> materias = new HashSet<>();
        for (Long matId : materiasIds) {
            Materia m = materiaRepository.findById(matId)
                    .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + matId));
            materias.add(m);
        }
        docente.setMaterias(materias);
        return docenteRepository.save(docente);
    }

    @Override
    public Docente removerMateria(Long docenteId, Long materiaId) {
        Docente docente = obtenerPorId(docenteId);
        docente.getMaterias().removeIf(m -> m.getId().equals(materiaId));
        return docenteRepository.save(docente);
    }

    @Override
    public void eliminar(Long id) {
        Docente docente = obtenerPorId(id);
        docenteRepository.delete(docente);
    }
}
