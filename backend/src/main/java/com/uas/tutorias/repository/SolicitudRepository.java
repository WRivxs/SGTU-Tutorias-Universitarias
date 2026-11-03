package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    @Query("SELECT DISTINCT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa " +
           "LEFT JOIN FETCH s.tutoria t " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario")
    List<Solicitud> findAll();

    @Query("SELECT DISTINCT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa " +
           "LEFT JOIN FETCH s.tutoria t " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "WHERE e.id = :estudianteId OR e.usuario.id = :estudianteId")
    List<Solicitud> findByEstudianteId(@Param("estudianteId") Long estudianteId);

    @Query("SELECT DISTINCT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa " +
           "LEFT JOIN FETCH s.tutoria t " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "WHERE t.id = :tutoriaId")
    List<Solicitud> findByTutoriaId(@Param("tutoriaId") Long tutoriaId);

    boolean existsByEstudianteIdAndTutoriaId(Long estudianteId, Long tutoriaId);

    @Query("SELECT DISTINCT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa " +
           "LEFT JOIN FETCH s.tutoria t " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "WHERE t.docente.id = :docenteId OR t.docente.usuario.id = :docenteId")
    List<Solicitud> findByDocenteIdOrDocenteUsuarioId(@Param("docenteId") Long docenteId);
}
