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
@Table(name = "estudiantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estudiante")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @NotNull(message = "El usuario es obligatorio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id", nullable = false)
    @NotNull(message = "El programa académico es obligatorio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Programa programa;

    @NotNull(message = "El semestre actual es obligatorio")
    @Min(value = 1, message = "El semestre mínimo es 1")
    @Max(value = 12, message = "El semestre máximo es 12")
    @Column(name = "semestre_actual", nullable = false)
    private Integer semestreActual = 1;

    @NotBlank(message = "El código estudiantil es obligatorio")
    @Column(name = "codigo_estudiantil", nullable = false, unique = true, length = 30)
    private String codigoEstudiantil;
}
