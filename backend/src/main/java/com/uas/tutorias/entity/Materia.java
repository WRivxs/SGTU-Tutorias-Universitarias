package com.uas.tutorias.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "materias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_materia")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id", nullable = false)
    @NotNull(message = "El programa académico es obligatorio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Programa programa;

    @NotBlank(message = "El nombre de la materia es obligatorio")
    @Column(nullable = false, length = 120)
    private String nombre;

    @NotBlank(message = "El código de la materia es obligatorio")
    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @NotNull(message = "El semestre es obligatorio")
    @Min(value = 1, message = "El semestre mínimo es 1")
    @Max(value = 12, message = "El semestre máximo es 12")
    @Column(nullable = false)
    private Integer semestre;

    @NotNull(message = "Los créditos son obligatorios")
    @Min(value = 1, message = "Los créditos mínimos son 1")
    @Column(nullable = false)
    private Integer creditos = 3;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private Boolean estado = true;
}
