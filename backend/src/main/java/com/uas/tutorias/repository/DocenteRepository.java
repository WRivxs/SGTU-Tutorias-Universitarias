package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DocenteRepository extends JpaRepository<Docente, Long> {

    @Query("SELECT DISTINCT d FROM Docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH d.materias")
    List<Docente> findAll();

    @Query("SELECT DISTINCT d FROM Docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "LEFT JOIN FETCH d.materias " +
           "WHERE d.usuario.id = :usuarioId")
    Optional<Docente> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    boolean existsByUsuarioId(Long usuarioId);

    @Query("SELECT DISTINCT d FROM Docente d " +
           "LEFT JOIN FETCH d.usuario " +
           "JOIN d.materias m WHERE m.id = :materiaId")
    List<Docente> findByMateriaId(@Param("materiaId") Long materiaId);
}
