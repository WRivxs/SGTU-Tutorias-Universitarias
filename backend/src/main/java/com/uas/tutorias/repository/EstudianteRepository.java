package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    @Query("SELECT DISTINCT e FROM Estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa p " +
           "LEFT JOIN FETCH p.facultad")
    List<Estudiante> findAll();

    @Query("SELECT DISTINCT e FROM Estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE e.usuario.id = :usuarioId")
    Optional<Estudiante> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT DISTINCT e FROM Estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE e.codigoEstudiantil = :codigoEstudiantil")
    Optional<Estudiante> findByCodigoEstudiantil(@Param("codigoEstudiantil") String codigoEstudiantil);

    @Query("SELECT DISTINCT e FROM Estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId")
    List<Estudiante> findByProgramaId(@Param("programaId") Long programaId);

    @Query("SELECT DISTINCT e FROM Estudiante e " +
           "LEFT JOIN FETCH e.usuario " +
           "LEFT JOIN FETCH e.programa p " +
           "LEFT JOIN FETCH p.facultad " +
           "WHERE p.id = :programaId AND e.semestreActual = :semestreActual")
    List<Estudiante> findByProgramaIdAndSemestreActual(@Param("programaId") Long programaId, @Param("semestreActual") Integer semestreActual);

    boolean existsByUsuarioId(Long usuarioId);
    boolean existsByCodigoEstudiantil(String codigoEstudiantil);
}
