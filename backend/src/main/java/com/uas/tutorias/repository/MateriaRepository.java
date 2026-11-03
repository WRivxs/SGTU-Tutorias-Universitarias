package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MateriaRepository extends JpaRepository<Materia, Long> {

    @Query("SELECT DISTINCT m FROM Materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad")
    List<Materia> findAll();

    @Query("SELECT DISTINCT m FROM Materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE m.estado = :estado")
    List<Materia> findByEstado(@Param("estado") Boolean estado);

    @Query("SELECT DISTINCT m FROM Materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId")
    List<Materia> findByProgramaId(@Param("programaId") Long programaId);

    @Query("SELECT DISTINCT m FROM Materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId AND m.estado = :estado")
    List<Materia> findByProgramaIdAndEstado(@Param("programaId") Long programaId, @Param("estado") Boolean estado);

    @Query("SELECT DISTINCT m FROM Materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId AND m.semestre = :semestre")
    List<Materia> findByProgramaIdAndSemestre(@Param("programaId") Long programaId, @Param("semestre") Integer semestre);

    @Query("SELECT DISTINCT m FROM Materia m " +
           "LEFT JOIN FETCH m.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId AND m.semestre = :semestre AND m.estado = :estado")
    List<Materia> findByProgramaIdAndSemestreAndEstado(@Param("programaId") Long programaId, @Param("semestre") Integer semestre, @Param("estado") Boolean estado);

    Optional<Materia> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
}
