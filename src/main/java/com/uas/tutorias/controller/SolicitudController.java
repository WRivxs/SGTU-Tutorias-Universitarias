package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Solicitud;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.SolicitudRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudRepository solicitudRepository;

    // GET /api/solicitudes
    @GetMapping
    public List<Solicitud> listar() {
        return solicitudRepository.findAll();
    }

    // GET /api/solicitudes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> obtener(@PathVariable Long id) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con id: " + id));
        return ResponseEntity.ok(solicitud);
    }

    // POST /api/solicitudes
    @PostMapping
    public ResponseEntity<Solicitud> crear(@Valid @RequestBody Solicitud solicitud) {
        Solicitud guardada = solicitudRepository.save(solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/solicitudes/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> actualizar(@PathVariable Long id, @Valid @RequestBody Solicitud datos) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con id: " + id));
        solicitud.setEstado(datos.getEstado());
        solicitud.setComentario(datos.getComentario());
        return ResponseEntity.ok(solicitudRepository.save(solicitud));
    }

    // DELETE /api/solicitudes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con id: " + id));
        solicitudRepository.delete(solicitud);
        return ResponseEntity.noContent().build();
    }
}
