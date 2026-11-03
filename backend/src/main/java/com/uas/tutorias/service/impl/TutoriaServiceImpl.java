package com.uas.tutorias.service.impl;

import com.uas.tutorias.entity.Docente;
import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.entity.Tutoria;
import com.uas.tutorias.exception.BadRequestException;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.DocenteRepository;
import com.uas.tutorias.repository.MateriaRepository;
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
    private final DocenteRepository docenteRepository;
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
    public List<Tutoria> listarPorDocente(Long docenteId) {
        return tutoriaRepository.findByDocenteId(docenteId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tutoria> listarPorPrograma(Long programaId) {
        return tutoriaRepository.findByProgramaId(programaId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tutoria> listarPorProgramaYSemestre(Long programaId, Integer semestre) {
        return tutoriaRepository.findByProgramaIdAndSemestre(programaId, semestre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tutoria> listarConFiltros(Long programaId, Integer semestre, Long materiaId, Long docenteId, Tutoria.Estado estado) {
        if (docenteId != null && estado != null) {
            return tutoriaRepository.findByDocenteIdAndEstado(docenteId, estado);
        }
        if (docenteId != null) {
            return tutoriaRepository.findByDocenteId(docenteId);
        }
        if (programaId != null && semestre != null && estado != null) {
            return tutoriaRepository.findByProgramaIdAndSemestreAndEstado(programaId, semestre, estado);
        }
        if (programaId != null && semestre != null) {
            return tutoriaRepository.findByProgramaIdAndSemestre(programaId, semestre);
        }
        if (programaId != null && estado != null) {
            return tutoriaRepository.findByProgramaIdAndEstado(programaId, estado);
        }
        if (programaId != null) {
            return tutoriaRepository.findByProgramaId(programaId);
        }
        if (materiaId != null) {
            return tutoriaRepository.findByMateriaId(materiaId);
        }
        if (estado != null) {
            return tutoriaRepository.findByEstado(estado);
        }
        return tutoriaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Tutoria obtenerPorId(Long id) {
        return tutoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoría no encontrada con id: " + id));
    }

    @Override
    public Tutoria crear(Tutoria tutoria) {
        if (tutoria.getDocente() == null || tutoria.getDocente().getId() == null) {
            throw new BadRequestException("Debe indicar el docente responsable de la tutoría");
        }
        if (tutoria.getMateria() == null || tutoria.getMateria().getId() == null) {
            throw new BadRequestException("Debe indicar la materia para la tutoría");
        }

        Long docenteId = tutoria.getDocente().getId();
        Docente docente = docenteRepository.findById(docenteId)
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado con id: " + docenteId));

        Long materiaId = tutoria.getMateria().getId();
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + materiaId));

        if (Boolean.FALSE.equals(materia.getEstado())) {
            throw new BadRequestException("No se puede programar una tutoría para una materia inactiva");
        }

        // Validación de negocio: Verificar si el docente tiene autorizada esta materia (si tiene asignaciones)
        if (docente.getMaterias() != null && !docente.getMaterias().isEmpty()) {
            boolean autorizada = docente.getMaterias().stream().anyMatch(m -> m.getId().equals(materiaId));
            if (!autorizada) {
                throw new BadRequestException("El docente no tiene asignada la materia: " + materia.getNombre());
            }
        }

        tutoria.setDocente(docente);
        tutoria.setMateria(materia);
        if (tutoria.getCupoMaximo() == null || tutoria.getCupoMaximo() <= 0) {
            tutoria.setCupoMaximo(5);
        }
        if (tutoria.getEstado() == null) {
            tutoria.setEstado(Tutoria.Estado.DISPONIBLE);
        }

        return tutoriaRepository.save(tutoria);
    }

    @Override
    public Tutoria actualizar(Long id, Tutoria datos) {
        Tutoria tutoria = obtenerPorId(id);

        if (datos.getDocente() != null && datos.getDocente().getId() != null) {
            Long docenteId = datos.getDocente().getId();
            Docente docente = docenteRepository.findById(docenteId)
                    .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado con id: " + docenteId));
            tutoria.setDocente(docente);
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
        if (datos.getCupoMaximo() != null && datos.getCupoMaximo() > 0) {
            tutoria.setCupoMaximo(datos.getCupoMaximo());
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
