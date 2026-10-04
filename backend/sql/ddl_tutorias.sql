-- =====================================================================
-- Sistema de Gestión de Tutorías Universitarias
-- Script DDL - Base de datos MySQL (AWS RDS)
-- Entrega 2 - Modelado de BD + Backend Inicial
-- =====================================================================

CREATE DATABASE IF NOT EXISTS tutorias_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tutorias_db;

-- ---------------------------------------------------------------------
-- Tabla: usuarios
-- Estudiantes, tutores y administradores comparten esta tabla base.
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario      BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)  NOT NULL,
    apellido        VARCHAR(100)  NOT NULL,
    correo          VARCHAR(150)  NOT NULL,
    password        VARCHAR(255)  NOT NULL,
    rol             ENUM('ADMINISTRADOR','TUTOR','ESTUDIANTE') NOT NULL,
    estado          BOOLEAN       NOT NULL DEFAULT TRUE,
    fecha_registro  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuarios_correo UNIQUE (correo)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: materias
-- ---------------------------------------------------------------------
CREATE TABLE materias (
    id_materia      BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)  NOT NULL,
    descripcion     VARCHAR(255),
    estado          BOOLEAN       NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: tutores
-- Perfil extendido de un usuario con rol TUTOR (relación 1:0..1).
-- ---------------------------------------------------------------------
CREATE TABLE tutores (
    id_tutor        BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      BIGINT        NOT NULL,
    especialidad    VARCHAR(100),
    descripcion     VARCHAR(255),
    disponibilidad  VARCHAR(100),
    CONSTRAINT uq_tutores_usuario UNIQUE (usuario_id),
    CONSTRAINT fk_tutores_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: tutorias
-- ---------------------------------------------------------------------
CREATE TABLE tutorias (
    id_tutoria      BIGINT AUTO_INCREMENT PRIMARY KEY,
    tutor_id        BIGINT        NOT NULL,
    materia_id      BIGINT        NOT NULL,
    fecha           DATE          NOT NULL,
    hora            TIME          NOT NULL,
    modalidad       ENUM('PRESENCIAL','VIRTUAL') NOT NULL,
    lugar           VARCHAR(150),
    descripcion     VARCHAR(255),
    estado          ENUM('DISPONIBLE','OCUPADA','CANCELADA','FINALIZADA') NOT NULL DEFAULT 'DISPONIBLE',
    CONSTRAINT fk_tutorias_tutor FOREIGN KEY (tutor_id)
        REFERENCES tutores(id_tutor)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_tutorias_materia FOREIGN KEY (materia_id)
        REFERENCES materias(id_materia)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: solicitudes
-- ---------------------------------------------------------------------
CREATE TABLE solicitudes (
    id_solicitud     BIGINT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id    BIGINT        NOT NULL,
    tutoria_id       BIGINT        NOT NULL,
    fecha_solicitud  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado           ENUM('PENDIENTE','ACEPTADA','RECHAZADA','CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    comentario       VARCHAR(255),
    CONSTRAINT fk_solicitudes_estudiante FOREIGN KEY (estudiante_id)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_solicitudes_tutoria FOREIGN KEY (tutoria_id)
        REFERENCES tutorias(id_tutoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Índices adicionales recomendados
-- ---------------------------------------------------------------------
CREATE INDEX idx_tutorias_estado ON tutorias(estado);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- ---------------------------------------------------------------------
-- Datos de prueba (opcional, para probar los endpoints en Postman)
-- ---------------------------------------------------------------------
-- Contraseñas de prueba:
-- Admin:       Admin123*
-- Wadid (Tutor): Tutor123*
-- Eduardo (Estudiante): Estudiante123*
INSERT INTO usuarios (nombre, apellido, correo, password, rol) VALUES
('Admin', 'Sistema', 'admin@tutorias.com', '$2a$10$.GSS79c8LpcbugbFdmMwHup1LXTlHGxznUBvmQSQPBTciDnJmmo2a', 'ADMINISTRADOR'),
('Wadid', 'Rivas', 'wadid.tutor@tutorias.com', '$2a$10$gZM5P9s8QtRg.7QAXMKm1.xBrhVdKKTgaaxdcr9RKAXFn1LJAc2cS', 'TUTOR'),
('Eduardo', 'Bettin', 'eduardo.estudiante@tutorias.com', '$2a$10$PsgAsXHNb65OHM8ZyKbbbOaHzb.NqRGX3hek44obAN23E7mBAPM8.', 'ESTUDIANTE');

INSERT INTO materias (nombre, descripcion) VALUES
('Bases de Datos', 'Modelado y administración de bases de datos relacionales'),
('Programación Web', 'Desarrollo de aplicaciones web con frameworks modernos');

INSERT INTO tutores (usuario_id, especialidad, descripcion, disponibilidad) VALUES
(2, 'Bases de Datos', 'Tutor con experiencia en modelado relacional', 'Lunes y miércoles 3-5pm');
