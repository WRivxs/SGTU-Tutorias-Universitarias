package com.uas.tutorias.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "programas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Programa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_programa")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facultad_id", nullable = false)
    @NotNull(message = "La facultad es obligatoria")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Facultad facultad;

    @NotBlank(message = "El nombre del programa es obligatorio")
    @Column(nullable = false, length = 120)
    private String nombre;

    @NotBlank(message = "El código del programa es obligatorio")
    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private Boolean estado = true;
}
