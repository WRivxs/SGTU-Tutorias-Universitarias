-- =====================================================================
-- Sistema de Gestión de Tutorías Universitarias (SGTU)
-- Script de Datos Semilla (Data Seed) - Arquitectura Universitaria 3FN
-- Hashes BCrypt probados con Spring Security
-- Contraseñas de acceso:
--   - Administrador: admin@tutorias.com       / Admin123*
--   - Docente 1:    wadid.docente@tutorias.com/ Docente123*
--   - Docente 2:    maria.docente@tutorias.com/ Docente123*
--   - Estudiante 1: eduardo.estudiante@tutorias.com / Estudiante123*
--   - Estudiante 2: ana.estudiante@tutorias.com     / Estudiante123*
-- =====================================================================

USE tutorias_db;

-- ---------------------------------------------------------------------
-- 1. Facultades
-- ---------------------------------------------------------------------
INSERT INTO facultades (id_facultad, nombre, codigo, descripcion, estado) VALUES
(1, 'Facultad de Ingeniería y Ciencias Básicas', 'FAC-ING', 'Formación en ingeniería de software, sistemas e industrial', true),
(2, 'Facultad de Ciencias Económicas y Administrativas', 'FAC-CEA', 'Formación en administración, finanzas y contabilidad', true)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), descripcion = VALUES(descripcion);

-- ---------------------------------------------------------------------
-- 2. Programas Académicos
-- ---------------------------------------------------------------------
INSERT INTO programas (id_programa, facultad_id, nombre, codigo, descripcion, estado) VALUES
(1, 1, 'Ingeniería de Sistemas', 'PROG-SIS', 'Programa profesional de Ingeniería de Sistemas y Computación', true),
(2, 1, 'Ingeniería Industrial', 'PROG-IND', 'Optimización de procesos, producción y logística', true),
(3, 2, 'Administración de Empresas', 'PROG-ADM', 'Gestión estratégica, finanzas y liderazgo corporativo', true)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), facultad_id = VALUES(facultad_id);

-- ---------------------------------------------------------------------
-- 3. Materias (Asignadas a Programa y Semestre de Malla)
-- ---------------------------------------------------------------------
INSERT INTO materias (id_materia, programa_id, nombre, codigo, semestre, creditos, descripcion, estado) VALUES
-- Semestre 1 - Sistemas
(1, 1, 'Cálculo Diferencial', 'MAT-101', 1, 4, 'Límites, derivadas y aplicaciones', true),
(2, 1, 'Fundamentos de Programación', 'SIS-101', 1, 3, 'Lógica computacional y pseudocódigo', true),
-- Semestre 2 - Sistemas
(3, 1, 'Cálculo Integral', 'MAT-201', 2, 4, 'Integrales definidas, series y sucesiones', true),
(4, 1, 'Programación Orientada a Objetos', 'SIS-201', 2, 3, 'Paradigmas de clases, herencia y polimorfismo', true),
-- Semestre 3 - Sistemas
(5, 1, 'Estructuras de Datos', 'SIS-301', 3, 3, 'Listas, árboles, grafos y algoritmos de ordenamiento', true),
-- Semestre 4 - Sistemas
(6, 1, 'Bases de Datos I', 'SIS-401', 4, 3, 'Modelado relacional, SQL, DDL y normalización', true),
-- Semestre 5 - Sistemas
(7, 1, 'Programación Web', 'SIS-501', 5, 3, 'Desarrollo web moderno con Spring Boot y Angular', true),
(8, 1, 'Ingeniería de Software I', 'SIS-502', 5, 3, 'Metodologías ágiles Scrum, arquitectura y patrones', true),
-- Materias de Ingeniería Industrial
(9, 2, 'Investigación de Operaciones I', 'IND-401', 4, 3, 'Programación lineal y modelos simplex', true),
(10, 2, 'Control de Calidad', 'IND-601', 6, 3, 'Muestreo estadístico y normas ISO', true),
-- Materias de Administración
(11, 3, 'Contabilidad Financiera', 'ADM-201', 2, 3, 'Estados financieros, balance y flujo de caja', true)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), semestre = VALUES(semestre), programa_id = VALUES(programa_id);

-- ---------------------------------------------------------------------
-- 4. Usuarios Base (con Contraseñas Hasheadas en BCrypt)
-- ---------------------------------------------------------------------
INSERT INTO usuarios (id_usuario, nombre, apellido, correo, password, rol, telefono, estado, fecha_registro) VALUES
-- Admin
(1, 'Administrador', 'del Sistema', 'admin@tutorias.com', '$2a$10$.GSS79c8LpcbugbFdmMwHup1LXTlHGxznUBvmQSQPBTciDnJmmo2a', 'ADMINISTRADOR', '3001112233', true, NOW()),
-- Docentes
(2, 'Wadid', 'Rivas', 'wadid.docente@tutorias.com', '$2a$10$tZ3i5Wk/84lH2xSskv280.Kx2N264V6B/2pTszN2tZfB0hC5d/4zW', 'DOCENTE', '3004445566', true, NOW()),
(3, 'María', 'Fernández', 'maria.docente@tutorias.com', '$2a$10$tZ3i5Wk/84lH2xSskv280.Kx2N264V6B/2pTszN2tZfB0hC5d/4zW', 'DOCENTE', '3007778899', true, NOW()),
-- Estudiantes
(4, 'Eduardo', 'Bettin', 'eduardo.estudiante@tutorias.com', '$2a$10$PsgAsXHNb65OHM8ZyKbbbOaHzb.NqRGX3hek44obAN23E7mBAPM8.', 'ESTUDIANTE', '3101119988', true, NOW()),
(5, 'Ana', 'Martínez', 'ana.estudiante@tutorias.com', '$2a$10$PsgAsXHNb65OHM8ZyKbbbOaHzb.NqRGX3hek44obAN23E7mBAPM8.', 'ESTUDIANTE', '3102228877', true, NOW())
ON DUPLICATE KEY UPDATE password = VALUES(password), estado = VALUES(estado);

-- ---------------------------------------------------------------------
-- 5. Docentes (Perfiles Académicos)
-- ---------------------------------------------------------------------
INSERT INTO docentes (id_docente, usuario_id, especialidad, descripcion, disponibilidad) VALUES
(1, 2, 'Bases de Datos, Arquitectura de Software y Backend Java', 'Docente de planta con más de 8 años de experiencia en desarrollo empresarial', 'Lunes a Jueves 3:00 PM - 6:00 PM'),
(2, 3, 'Matemáticas Puras y Métodos Numéricos', 'Especialista en cálculo aplicado y álgebra lineal', 'Martes y Viernes 8:00 AM - 12:00 PM')
ON DUPLICATE KEY UPDATE especialidad = VALUES(especialidad), disponibilidad = VALUES(disponibilidad);

-- ---------------------------------------------------------------------
-- 6. Docente <-> Materias Asignadas (N:M)
-- Wadid dicta: Bases de Datos I, Programación Web, POO
-- María dicta: Cálculo Diferencial, Cálculo Integral
-- ---------------------------------------------------------------------
INSERT IGNORE INTO docente_materias (docente_id, materia_id) VALUES
-- Wadid Rivas
(1, 4), -- POO
(1, 6), -- Bases de Datos I
(1, 7), -- Programación Web
(1, 8), -- Ingeniería de Software I
-- María Fernández
(2, 1), -- Cálculo Diferencial
(2, 3); -- Cálculo Integral

-- ---------------------------------------------------------------------
-- 7. Estudiantes (Perfiles Académicos vinculados a Programa)
-- ---------------------------------------------------------------------
INSERT INTO estudiantes (id_estudiante, usuario_id, programa_id, semestre_actual, codigo_estudiantil) VALUES
(1, 4, 1, 5, 'SIS-2022-0145'), -- Eduardo está en 5to semestre de Sistemas
(2, 5, 1, 2, 'SIS-2024-0089')  -- Ana está en 2do semestre de Sistemas
ON DUPLICATE KEY UPDATE semestre_actual = VALUES(semestre_actual), programa_id = VALUES(programa_id);

-- ---------------------------------------------------------------------
-- 8. Tutorías Ofertadas
-- ---------------------------------------------------------------------
INSERT INTO tutorias (id_tutoria, docente_id, materia_id, fecha, hora, cupo_maximo, modalidad, lugar, descripcion, estado) VALUES
(1, 1, 6, '2026-11-05', '16:00:00', 6, 'PRESENCIAL', 'Laboratorio de Sistemas 302', 'Taller práctico de normalización 1FN, 2FN, 3FN y consultas SQL complejas', 'DISPONIBLE'),
(2, 1, 7, '2026-11-06', '18:00:00', 8, 'VIRTUAL', 'Enlace Google Meet institucional', 'Repaso de arquitectura de seguridad JWT y Angular Interceptors', 'DISPONIBLE'),
(3, 2, 1, '2026-11-07', '10:00:00', 5, 'PRESENCIAL', 'Aula 104 - Bloque de Ciencias', 'Asesoría para primer parcial: límites indeterminados y regla de L Hopital', 'DISPONIBLE')
ON DUPLICATE KEY UPDATE cupo_maximo = VALUES(cupo_maximo), estado = VALUES(estado);

-- ---------------------------------------------------------------------
-- 9. Solicitudes de Tutoría
-- ---------------------------------------------------------------------
INSERT INTO solicitudes (id_solicitud, estudiante_id, tutoria_id, fecha_solicitud, estado, comentario) VALUES
(1, 1, 1, NOW(), 'ACEPTADA', 'Necesito aclarar dudas sobre llaves compuestas y formas normales para el parcial'),
(2, 2, 3, NOW(), 'PENDIENTE', 'Deseo resolver ejercicios tipo examen de límites trigonométricos')
ON DUPLICATE KEY UPDATE estado = VALUES(estado);
