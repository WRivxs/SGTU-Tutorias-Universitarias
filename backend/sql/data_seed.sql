-- =====================================================================
-- Sistema de Gestión de Tutorías Universitarias (SGTU)
-- Script de Datos de Prueba Iniciales (Data Seed) con Hashes BCrypt
-- Entrega 3 - Backend Completo + Seguridad + Postman
-- =====================================================================

USE tutorias_db;

-- Limpieza opcional de tablas (orden respetando llaves foráneas)
-- DELETE FROM solicitudes;
-- DELETE FROM tutorias;
-- DELETE FROM tutores;
-- DELETE FROM materias;
-- DELETE FROM usuarios;

-- ---------------------------------------------------------------------
-- 1. Usuarios del Sistema
-- Credenciales de acceso:
-- - Administrador:  admin@tutorias.com       / Admin123*
-- - Tutor:          wadid.tutor@tutorias.com / Tutor123*
-- - Estudiante:     eduardo.estudiante@tutorias.com / Estudiante123*
-- ---------------------------------------------------------------------
INSERT INTO usuarios (id_usuario, nombre, apellido, correo, password, rol, estado, fecha_registro) VALUES
(1, 'Admin', 'Sistema', 'admin@tutorias.com', '$2a$10$.GSS79c8LpcbugbFdmMwHup1LXTlHGxznUBvmQSQPBTciDnJmmo2a', 'ADMINISTRADOR', true, NOW()),
(2, 'Wadid', 'Rivas', 'wadid.tutor@tutorias.com', '$2a$10$gZM5P9s8QtRg.7QAXMKm1.xBrhVdKKTgaaxdcr9RKAXFn1LJAc2cS', 'TUTOR', true, NOW()),
(3, 'Eduardo', 'Bettin', 'eduardo.estudiante@tutorias.com', '$2a$10$PsgAsXHNb65OHM8ZyKbbbOaHzb.NqRGX3hek44obAN23E7mBAPM8.', 'ESTUDIANTE', true, NOW())
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    estado = VALUES(estado);

-- ---------------------------------------------------------------------
-- 2. Materias
-- ---------------------------------------------------------------------
INSERT INTO materias (id_materia, nombre, descripcion, estado) VALUES
(1, 'Bases de Datos', 'Modelado y administración de bases de datos relacionales', true),
(2, 'Programación Web', 'Desarrollo de aplicaciones web con frameworks modernos', true),
(3, 'Estructuras de Datos', 'Algoritmos, complejidad y estructuras avanzadas', true)
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion);

-- ---------------------------------------------------------------------
-- 3. Tutores
-- ---------------------------------------------------------------------
INSERT INTO tutores (id_tutor, usuario_id, especialidad, descripcion, disponibilidad) VALUES
(1, 2, 'Bases de Datos y Backend', 'Tutor con experiencia en modelado relacional y Spring Boot', 'Lunes y miércoles 3-5pm')
ON DUPLICATE KEY UPDATE 
    especialidad = VALUES(especialidad),
    disponibilidad = VALUES(disponibilidad);

-- ---------------------------------------------------------------------
-- 4. Tutorías programadas
-- ---------------------------------------------------------------------
INSERT INTO tutorias (id_tutoria, tutor_id, materia_id, fecha, hora, modalidad, lugar, descripcion, estado) VALUES
(1, 1, 1, '2026-10-15', '15:00:00', 'VIRTUAL', 'Google Meet / Enlace en sala', 'Sesión de repaso de normalización y modelado relacional', 'DISPONIBLE'),
(2, 1, 2, '2026-10-16', '16:00:00', 'PRESENCIAL', 'Laboratorio de Sistemas 2', 'Introducción a desarrollo REST con Spring Boot', 'DISPONIBLE')
ON DUPLICATE KEY UPDATE 
    estado = VALUES(estado);
