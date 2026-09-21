package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Solicitud;
import com.uas.tutorias.service.SolicitudService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
public class SolicitudController {

    private final SolicitudService solicitudService;

    // GET /api/solicitudes?estudianteId=1
    @GetMapping
    public ResponseEntity<List<Solicitud>> listar(@RequestParam(required = false) Long estudianteId) {
        if (estudianteId != null) {
            return ResponseEntity.ok(solicitudService.listarPorEstudiante(estudianteId));
        }
        return ResponseEntity.ok(solicitudService.listarTodas());
    }

    // GET /api/solicitudes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.obtenerPorId(id));
    }

    // POST /api/solicitudes
    @PostMapping
    public ResponseEntity<Solicitud> crear(@Valid @RequestBody Solicitud solicitud) {
        Solicitud guardada = solicitudService.crear(solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/solicitudes/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> actualizar(@PathVariable Long id, @Valid @RequestBody Solicitud datos) {
        Solicitud actualizada = solicitudService.actualizar(id, datos);
        return ResponseEntity.ok(actualizada);
    }

    // PATCH /api/solicitudes/{id}/responder?estado=ACEPTADA&comentario=...
    @PatchMapping("/{id}/responder")
    public ResponseEntity<Solicitud> responder(
            @PathVariable Long id,
            @RequestParam Solicitud.Estado estado,
            @RequestParam(required = false) String comentario) {
        return ResponseEntity.ok(solicitudService.cambiarEstado(id, estado, comentario));
    }

    // DELETE /api/solicitudes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        solicitudService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
