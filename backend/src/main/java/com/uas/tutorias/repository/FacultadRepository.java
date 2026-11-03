package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Facultad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacultadRepository extends JpaRepository<Facultad, Long> {
    List<Facultad> findByEstado(Boolean estado);
    Optional<Facultad> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
    boolean existsByNombre(String nombre);
}
