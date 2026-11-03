package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Estudiante;
import com.uas.tutorias.entity.Programa;
import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.BadRequestException;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.EstudianteRepository;
import com.uas.tutorias.repository.ProgramaRepository;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.service.EstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EstudianteServiceImpl implements EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProgramaRepository programaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Estudiante> listarTodos() {
        return estudianteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Estudiante> listarPorPrograma(Long programaId) {
        return estudianteRepository.findByProgramaId(programaId);
    }

    @Override
    @Transactional(readOnly = true)
    public Estudiante obtenerPorId(Long id) {
        return estudianteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Estudiante obtenerPorUsuarioId(Long usuarioId) {
        return estudianteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil de estudiante no encontrado para usuario id: " + usuarioId));
    }

    @Override
    @Transactional(readOnly = true)
    public Estudiante obtenerPorCodigo(String codigoEstudiantil) {
        return estudianteRepository.findByCodigoEstudiantil(codigoEstudiantil)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con código: " + codigoEstudiantil));
    }

    @Override
    public Estudiante crear(Estudiante estudiante) {
        if (estudiante.getUsuario() == null || estudiante.getUsuario().getId() == null) {
            throw new BadRequestException("Debe especificar el id del usuario asociado");
        }
        Long usuarioId = estudiante.getUsuario().getId();
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId));

        if (usuario.getRol() != Usuario.Rol.ESTUDIANTE) {
            throw new ConflictException("El usuario debe tener rol ESTUDIANTE");
        }

        if (estudianteRepository.existsByUsuarioId(usuarioId)) {
            throw new ConflictException("El usuario ya tiene un perfil de estudiante registrado");
        }

        if (estudianteRepository.existsByCodigoEstudiantil(estudiante.getCodigoEstudiantil())) {
            throw new ConflictException("Ya existe un estudiante con el código: " + estudiante.getCodigoEstudiantil());
        }

        if (estudiante.getPrograma() == null || estudiante.getPrograma().getId() == null) {
            throw new BadRequestException("Debe especificar el programa académico al que pertenece el estudiante");
        }
        Programa programa = programaRepository.findById(estudiante.getPrograma().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado con id: " + estudiante.getPrograma().getId()));

        estudiante.setUsuario(usuario);
        estudiante.setPrograma(programa);
        return estudianteRepository.save(estudiante);
    }

    @Override
    public Estudiante actualizar(Long id, Estudiante datos) {
        Estudiante estudiante = obtenerPorId(id);
        if (datos.getCodigoEstudiantil() != null && !datos.getCodigoEstudiantil().equals(estudiante.getCodigoEstudiantil())) {
            if (estudianteRepository.existsByCodigoEstudiantil(datos.getCodigoEstudiantil())) {
                throw new ConflictException("Ya existe un estudiante con el código: " + datos.getCodigoEstudiantil());
            }
            estudiante.setCodigoEstudiantil(datos.getCodigoEstudiantil());
        }
        if (datos.getSemestreActual() != null) {
            estudiante.setSemestreActual(datos.getSemestreActual());
        }
        if (datos.getPrograma() != null && datos.getPrograma().getId() != null) {
            Programa programa = programaRepository.findById(datos.getPrograma().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado con id: " + datos.getPrograma().getId()));
            estudiante.setPrograma(programa);
        }
        return estudianteRepository.save(estudiante);
    }

    @Override
    public void eliminar(Long id) {
        Estudiante estudiante = obtenerPorId(id);
        estudianteRepository.delete(estudiante);
    }
}
