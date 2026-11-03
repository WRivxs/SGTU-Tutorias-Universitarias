package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Programa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProgramaRepository extends JpaRepository<Programa, Long> {

    @Query("SELECT DISTINCT p FROM Programa p LEFT JOIN FETCH p.facultad")
    List<Programa> findAll();

    @Query("SELECT DISTINCT p FROM Programa p LEFT JOIN FETCH p.facultad WHERE p.estado = :estado")
    List<Programa> findByEstado(@Param("estado") Boolean estado);

    @Query("SELECT DISTINCT p FROM Programa p LEFT JOIN FETCH p.facultad WHERE p.facultad.id = :facultadId")
    List<Programa> findByFacultadId(@Param("facultadId") Long facultadId);

    @Query("SELECT DISTINCT p FROM Programa p LEFT JOIN FETCH p.facultad WHERE p.facultad.id = :facultadId AND p.estado = :estado")
    List<Programa> findByFacultadIdAndEstado(@Param("facultadId") Long facultadId, @Param("estado") Boolean estado);

    Optional<Programa> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
}
