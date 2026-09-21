package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Tutoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TutoriaRepository extends JpaRepository<Tutoria, Long> {
    List<Tutoria> findByEstado(Tutoria.Estado estado);
    List<Tutoria> findByMateriaId(Long materiaId);
}
