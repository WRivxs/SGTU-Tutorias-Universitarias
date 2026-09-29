package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.service.MateriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaService materiaService;

    // GET /api/materias
    @GetMapping
    public ResponseEntity<List<Materia>> listar(@RequestParam(required = false) Boolean estado) {
        if (estado != null) {
            return ResponseEntity.ok(materiaService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(materiaService.listarTodas());
    }

    // GET /api/materias/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Materia> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(materiaService.obtenerPorId(id));
    }

    // POST /api/materias
    @PostMapping
    public ResponseEntity<Materia> crear(@Valid @RequestBody Materia materia) {
        Materia guardada = materiaService.crear(materia);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/materias/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Materia> actualizar(@PathVariable Long id, @Valid @RequestBody Materia datos) {
        Materia actualizada = materiaService.actualizar(id, datos);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE /api/materias/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        materiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
