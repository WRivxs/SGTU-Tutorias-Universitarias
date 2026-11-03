-- =====================================================================
-- Sistema de Gestión de Tutorías Universitarias (SGTU)
-- Script DDL - Base de Datos Relacional MySQL 8 (Normalizado 3FN)
-- Arquitectura Universitaria: Facultad -> Programa -> Materias (Malla)
-- Relaciones N:M: Docente <-> Materias | Perfiles Especializados
-- =====================================================================

CREATE DATABASE IF NOT EXISTS tutorias_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tutorias_db;

-- ---------------------------------------------------------------------
-- 0. Limpieza ordenada de tablas (respetando integridad referencial)
-- ---------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS solicitudes;
DROP TABLE IF EXISTS tutorias;
DROP TABLE IF EXISTS docente_materias;
DROP TABLE IF EXISTS tutores_materias;
DROP TABLE IF EXISTS docentes;
DROP TABLE IF EXISTS tutores;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS materias;
DROP TABLE IF EXISTS programas;
DROP TABLE IF EXISTS facultades;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. Tabla: facultades
-- Catálogo de unidades académicas mayores de la universidad.
-- ---------------------------------------------------------------------
CREATE TABLE facultades (
    id_facultad     BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(120) NOT NULL,
    codigo          VARCHAR(20)  NOT NULL,
    descripcion     VARCHAR(255),
    estado          BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_facultades_nombre UNIQUE (nombre),
    CONSTRAINT uq_facultades_codigo UNIQUE (codigo)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. Tabla: programas
-- Carreras académicas adscritas a una facultad (1:N).
-- ---------------------------------------------------------------------
CREATE TABLE programas (
    id_programa     BIGINT AUTO_INCREMENT PRIMARY KEY,
    facultad_id     BIGINT       NOT NULL,
    nombre          VARCHAR(120) NOT NULL,
    codigo          VARCHAR(20)  NOT NULL,
    descripcion     VARCHAR(255),
    estado          BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_programas_codigo UNIQUE (codigo),
    CONSTRAINT fk_programas_facultad FOREIGN KEY (facultad_id)
        REFERENCES facultades(id_facultad)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. Tabla: materias
-- Asignaturas pertenecientes a un programa y ubicadas en su malla (semestre 1 al 10).
-- ---------------------------------------------------------------------
CREATE TABLE materias (
    id_materia      BIGINT AUTO_INCREMENT PRIMARY KEY,
    programa_id     BIGINT       NOT NULL,
    nombre          VARCHAR(120) NOT NULL,
    codigo          VARCHAR(20)  NOT NULL,
    semestre        INT          NOT NULL,
    creditos        INT          NOT NULL DEFAULT 3,
    descripcion     VARCHAR(255),
    estado          BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_materias_codigo UNIQUE (codigo),
    CONSTRAINT chk_materias_semestre CHECK (semestre BETWEEN 1 AND 12),
    CONSTRAINT fk_materias_programa FOREIGN KEY (programa_id)
        REFERENCES programas(id_programa)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. Tabla: usuarios
-- Tabla base de identidad, credenciales y autenticación (Spring Security).
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario      BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    correo          VARCHAR(150) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    rol             ENUM('ADMINISTRADOR','DOCENTE','ESTUDIANTE') NOT NULL,
    telefono        VARCHAR(25),
    estado          BOOLEAN      NOT NULL DEFAULT TRUE,
    fecha_registro  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuarios_correo UNIQUE (correo)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. Tabla: docentes
-- Perfil académico del docente (relación 1:1 con usuarios de rol DOCENTE).
-- ---------------------------------------------------------------------
CREATE TABLE docentes (
    id_docente      BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      BIGINT       NOT NULL,
    especialidad    VARCHAR(150),
    descripcion     VARCHAR(255),
    disponibilidad  VARCHAR(150),
    CONSTRAINT uq_docentes_usuario UNIQUE (usuario_id),
    CONSTRAINT fk_docentes_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. Tabla intermedia: docente_materias
-- Relación N:M que define las asignaturas que un docente está facultado para dictar.
-- ---------------------------------------------------------------------
CREATE TABLE docente_materias (
    docente_id      BIGINT NOT NULL,
    materia_id      BIGINT NOT NULL,
    PRIMARY KEY (docente_id, materia_id),
    CONSTRAINT fk_dm_docente FOREIGN KEY (docente_id)
        REFERENCES docentes(id_docente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_dm_materia FOREIGN KEY (materia_id)
        REFERENCES materias(id_materia)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. Tabla: estudiantes
-- Perfil académico del estudiante (relación 1:1 con usuarios de rol ESTUDIANTE).
-- Vincula al estudiante con su carrera (programa) y semestre de referencia.
-- ---------------------------------------------------------------------
CREATE TABLE estudiantes (
    id_estudiante       BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id          BIGINT      NOT NULL,
    programa_id         BIGINT      NOT NULL,
    semestre_actual     INT         NOT NULL DEFAULT 1,
    codigo_estudiantil  VARCHAR(30) NOT NULL,
    CONSTRAINT uq_estudiantes_usuario UNIQUE (usuario_id),
    CONSTRAINT uq_estudiantes_codigo UNIQUE (codigo_estudiantil),
    CONSTRAINT chk_estudiante_semestre CHECK (semestre_actual BETWEEN 1 AND 12),
    CONSTRAINT fk_estudiantes_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_estudiantes_programa FOREIGN KEY (programa_id)
        REFERENCES programas(id_programa)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. Tabla: tutorias
-- Sesiones de tutoría ofertadas por un docente para una asignatura específica.
-- ---------------------------------------------------------------------
CREATE TABLE tutorias (
    id_tutoria      BIGINT AUTO_INCREMENT PRIMARY KEY,
    docente_id      BIGINT       NOT NULL,
    materia_id      BIGINT       NOT NULL,
    fecha           DATE         NOT NULL,
    hora            TIME         NOT NULL,
    cupo_maximo     INT          NOT NULL DEFAULT 5,
    modalidad       ENUM('PRESENCIAL','VIRTUAL') NOT NULL,
    lugar           VARCHAR(150),
    descripcion     VARCHAR(255),
    estado          ENUM('DISPONIBLE','OCUPADA','CANCELADA','FINALIZADA') NOT NULL DEFAULT 'DISPONIBLE',
    CONSTRAINT chk_tutoria_cupo CHECK (cupo_maximo > 0),
    CONSTRAINT fk_tutorias_docente FOREIGN KEY (docente_id)
        REFERENCES docentes(id_docente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_tutorias_materia FOREIGN KEY (materia_id)
        REFERENCES materias(id_materia)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. Tabla: solicitudes
-- Solicitudes de inscripción de estudiantes a una sesión de tutoría.
-- ---------------------------------------------------------------------
CREATE TABLE solicitudes (
    id_solicitud     BIGINT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id    BIGINT       NOT NULL,
    tutoria_id       BIGINT       NOT NULL,
    fecha_solicitud  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado           ENUM('PENDIENTE','ACEPTADA','RECHAZADA','CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    comentario       VARCHAR(255),
    CONSTRAINT uq_solicitud_estudiante_tutoria UNIQUE (estudiante_id, tutoria_id),
    CONSTRAINT fk_solicitudes_estudiante FOREIGN KEY (estudiante_id)
        REFERENCES estudiantes(id_estudiante)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_solicitudes_tutoria FOREIGN KEY (tutoria_id)
        REFERENCES tutorias(id_tutoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. Índices de optimización de consultas
-- ---------------------------------------------------------------------
CREATE INDEX idx_programas_facultad ON programas(facultad_id);
CREATE INDEX idx_materias_programa ON materias(programa_id);
CREATE INDEX idx_materias_semestre ON materias(semestre);
CREATE INDEX idx_estudiantes_programa ON estudiantes(programa_id);
CREATE INDEX idx_tutorias_materia ON tutorias(materia_id);
CREATE INDEX idx_tutorias_docente ON tutorias(docente_id);
CREATE INDEX idx_tutorias_fecha ON tutorias(fecha);
CREATE INDEX idx_tutorias_estado ON tutorias(estado);
CREATE INDEX idx_solicitudes_tutoria ON solicitudes(tutoria_id);
CREATE INDEX idx_solicitudes_estudiante ON solicitudes(estudiante_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
