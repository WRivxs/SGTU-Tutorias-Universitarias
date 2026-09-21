package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Tutor;
import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.BadRequestException;
import com.uas.tutorias.exception.ConflictException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.TutorRepository;
import com.uas.tutorias.repository.UsuarioRepository;
import com.uas.tutorias.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Tutor> listarTodos() {
        return tutorRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Tutor obtenerPorId(Long id) {
        return tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado con id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Tutor obtenerPorUsuarioId(Long usuarioId) {
        return tutorRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado para el usuario con id: " + usuarioId));
    }

    @Override
    public Tutor crear(Tutor tutor) {
        if (tutor.getUsuario() == null || tutor.getUsuario().getId() == null) {
            throw new BadRequestException("Debe especificar el id del usuario asociado al tutor");
        }

        Long usuarioId = tutor.getUsuario().getId();
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId));

        if (usuario.getRol() != Usuario.Rol.TUTOR) {
            throw new BadRequestException("El usuario asociado debe tener el rol TUTOR. Rol actual: " + usuario.getRol());
        }

        if (tutorRepository.existsByUsuarioId(usuarioId)) {
            throw new ConflictException("El usuario con id " + usuarioId + " ya tiene un perfil de tutor registrado");
        }

        tutor.setUsuario(usuario);
        return tutorRepository.save(tutor);
    }

    @Override
    public Tutor actualizar(Long id, Tutor datos) {
        Tutor tutor = obtenerPorId(id);
        tutor.setEspecialidad(datos.getEspecialidad());
        tutor.setDescripcion(datos.getDescripcion());
        tutor.setDisponibilidad(datos.getDisponibilidad());
        return tutorRepository.save(tutor);
    }

    @Override
    public void eliminar(Long id) {
        Tutor tutor = obtenerPorId(id);
        tutorRepository.delete(tutor);
    }
}
