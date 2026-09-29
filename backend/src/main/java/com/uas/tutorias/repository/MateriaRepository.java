package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MateriaRepository extends JpaRepository<Materia, Long> {
    List<Materia> findByEstado(Boolean estado);
}
