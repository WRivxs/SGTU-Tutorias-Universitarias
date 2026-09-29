package com.uas.tutorias.repository;

import com.uas.tutorias.entity.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TutorRepository extends JpaRepository<Tutor, Long> {
    Optional<Tutor> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioId(Long usuarioId);
}
