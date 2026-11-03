package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Tutoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TutoriaRepository extends JpaRepository<Tutoria, Long> {

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad")
    List<Tutoria> findAll();

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE t.estado = :estado")
    List<Tutoria> findByEstado(@Param("estado") Tutoria.Estado estado);

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE m.id = :materiaId")
    List<Tutoria> findByMateriaId(@Param("materiaId") Long materiaId);

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE d.id = :docenteId")
    List<Tutoria> findByDocenteId(@Param("docenteId") Long docenteId);

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE d.id = :docenteId AND t.estado = :estado")
    List<Tutoria> findByDocenteIdAndEstado(@Param("docenteId") Long docenteId, @Param("estado") Tutoria.Estado estado);

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId")
    List<Tutoria> findByProgramaId(@Param("programaId") Long programaId);

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId AND m.semestre = :semestre")
    List<Tutoria> findByProgramaIdAndSemestre(@Param("programaId") Long programaId, @Param("semestre") Integer semestre);

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId AND t.estado = :estado")
    List<Tutoria> findByProgramaIdAndEstado(@Param("programaId") Long programaId, @Param("estado") Tutoria.Estado estado);

    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH t.materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId AND m.semestre = :semestre AND t.estado = :estado")
    List<Tutoria> findByProgramaIdAndSemestreAndEstado(@Param("programaId") Long programaId, @Param("semestre") Integer semestre, @Param("estado") Tutoria.Estado estado);
}
