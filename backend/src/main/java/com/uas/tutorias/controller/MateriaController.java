package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.service.MateriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@RequiredArgsConstructor
@Tag(name = "Materias", description = "Gestión del catálogo de asignaturas o materias")
public class MateriaController {

    private final MateriaService materiaService;

    // GET /api/materias
    @Operation(summary = "Listar materias", description = "Disponible para ADMINISTRADOR, TUTOR y ESTUDIANTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR') or hasRole('ESTUDIANTE')")
    @GetMapping
    public ResponseEntity<List<Materia>> listar(@RequestParam(required = false) Boolean estado) {
        if (estado != null) {
            return ResponseEntity.ok(materiaService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(materiaService.listarTodas());
    }

    // GET /api/materias/{id}
    @Operation(summary = "Obtener materia por ID", description = "Disponible para ADMINISTRADOR, TUTOR y ESTUDIANTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Materia> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(materiaService.obtenerPorId(id));
    }

    // POST /api/materias
    @Operation(summary = "Crear materia", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<Materia> crear(@Valid @RequestBody Materia materia) {
        Materia guardada = materiaService.crear(materia);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/materias/{id}
    @Operation(summary = "Actualizar materia", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Materia> actualizar(@PathVariable Long id, @Valid @RequestBody Materia datos) {
        Materia actualizada = materiaService.actualizar(id, datos);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE /api/materias/{id}
    @Operation(summary = "Eliminar materia", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        materiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
