package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.entity.Tutor;
import com.uas.tutorias.entity.Tutoria;
import com.uas.tutorias.exception.BadRequestException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.MateriaRepository;
import com.uas.tutorias.repository.TutorRepository;
import com.uas.tutorias.repository.TutoriaRepository;
import com.uas.tutorias.service.TutoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TutoriaServiceImpl implements TutoriaService {

    private final TutoriaRepository tutoriaRepository;
    private final TutorRepository tutorRepository;
    private final MateriaRepository materiaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Tutoria> listarTodas() {
        return tutoriaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tutoria> listarPorEstado(Tutoria.Estado estado) {
        return tutoriaRepository.findByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tutoria> listarPorMateria(Long materiaId) {
        return tutoriaRepository.findByMateriaId(materiaId);
    }

    @Override
    @Transactional(readOnly = true)
    public Tutoria obtenerPorId(Long id) {
        return tutoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoría no encontrada con id: " + id));
    }

    @Override
    public Tutoria crear(Tutoria tutoria) {
        if (tutoria.getTutor() == null || tutoria.getTutor().getId() == null) {
            throw new BadRequestException("Debe indicar el tutor responsable de la tutoría");
        }
        if (tutoria.getMateria() == null || tutoria.getMateria().getId() == null) {
            throw new BadRequestException("Debe indicar la materia para la tutoría");
        }

        Long tutorId = tutoria.getTutor().getId();
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado con id: " + tutorId));

        Long materiaId = tutoria.getMateria().getId();
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + materiaId));

        if (Boolean.FALSE.equals(materia.getEstado())) {
            throw new BadRequestException("No se puede programar una tutoría para una materia inactiva");
        }

        tutoria.setTutor(tutor);
        tutoria.setMateria(materia);
        if (tutoria.getEstado() == null) {
            tutoria.setEstado(Tutoria.Estado.DISPONIBLE);
        }

        return tutoriaRepository.save(tutoria);
    }

    @Override
    public Tutoria actualizar(Long id, Tutoria datos) {
        Tutoria tutoria = obtenerPorId(id);

        if (datos.getTutor() != null && datos.getTutor().getId() != null) {
            Long tutorId = datos.getTutor().getId();
            Tutor tutor = tutorRepository.findById(tutorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado con id: " + tutorId));
            tutoria.setTutor(tutor);
        }

        if (datos.getMateria() != null && datos.getMateria().getId() != null) {
            Long materiaId = datos.getMateria().getId();
            Materia materia = materiaRepository.findById(materiaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + materiaId));
            tutoria.setMateria(materia);
        }

        if (datos.getFecha() != null) {
            tutoria.setFecha(datos.getFecha());
        }
        if (datos.getHora() != null) {
            tutoria.setHora(datos.getHora());
        }
        if (datos.getModalidad() != null) {
            tutoria.setModalidad(datos.getModalidad());
        }
        if (datos.getLugar() != null) {
            tutoria.setLugar(datos.getLugar());
        }
        if (datos.getDescripcion() != null) {
            tutoria.setDescripcion(datos.getDescripcion());
        }
        if (datos.getEstado() != null) {
            tutoria.setEstado(datos.getEstado());
        }

        return tutoriaRepository.save(tutoria);
    }

    @Override
    public Tutoria cambiarEstado(Long id, Tutoria.Estado nuevoEstado) {
        Tutoria tutoria = obtenerPorId(id);
        tutoria.setEstado(nuevoEstado);
        return tutoriaRepository.save(tutoria);
    }

    @Override
    public void eliminar(Long id) {
        Tutoria tutoria = obtenerPorId(id);
        tutoriaRepository.delete(tutoria);
    }
}
