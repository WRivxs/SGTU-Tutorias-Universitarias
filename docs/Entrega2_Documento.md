# ENTREGA 2 – Modelado de Base de Datos y Backend Inicial
## Sistema de Gestión de Tutorías Universitarias (SGTU)

*Formato Institucional — Corporación Universitaria Antonio José de Sucre (UNIAJS)*  
*Programa de Ingeniería de Sistemas — Electiva Profesional II*  

---

### Datos del Proyecto:
* **Nombre del Proyecto:** SGTU — Sistema de Gestión de Tutorías Universitarias
* **Curso:** Electiva Profesional II
* **Docente Evaluador:** Ing. Jaider de la Rosa Bertel
* **Integrantes del Equipo:**
  1. Wadid Rivas Payares
  2. Azael Espitia Toribio
  3. Eduardo Julio Bettin Avilez
  4. Jhon Jader Bertel Ortega
* **Enlace al Repositorio Oficial (GitHub):** [https://github.com/WRivxs/SGTU-Tutorias-Universitarias](https://github.com/WRivxs/SGTU-Tutorias-Universitarias)
* **Base de Datos en la Nube:** MySQL 8 en Amazon Web Services (AWS RDS)

---

## 1. Introducción

En esta segunda entrega se presenta el modelo de datos relacional normalizado hasta la Tercera Forma Normal (3FN), su despliegue en la nube mediante una instancia gestionada de MySQL 8 en Amazon Web Services (AWS RDS) y la implementación de la primera versión del backend con Spring Boot 3 y Spring Data JPA.

A partir de la retroalimentación docente, el modelo evolucionó desde una estructura genérica hacia una **arquitectura académica universitaria robusta**, capaz de modelar facultades, programas académicos, asignaturas ubicadas en la malla curricular por semestre, perfiles académicos especializados (Docente y Estudiante) y relaciones de impartición muchos a muchos (N:M).

---

## 2. Modelo Entidad-Relación y Cambios de la Refactorización

### 2.1 Justificación de los Cambios del Modelo Universitario

| Cambio Arquitectónico | Justificación de Ingeniería y Normalización (3FN) |
|---|---|
| **Incorporación de `facultades` y `programas`** | Modela la jerarquía académica real (1 Facultad contiene N Programas; 1 Programa contiene N Materias), evitando redundancias de nombres en texto libre. |
| **Malla curricular en `materias`** | Cada materia queda adscrita a un programa, con su semestre de ubicación (1 a 10) y número de créditos académicos. |
| **Separación de Identidad y Perfil Académico** | La tabla `usuarios` gestiona credenciales de acceso (correo, password BCrypt, rol). Las tablas `docentes` y `estudiantes` almacenan los atributos especializados de cada actor sin campos nulos innecesarios. |
| **Relación N:M `docente_materias`** | Permite que un docente dicte múltiples asignaturas de su especialidad y que una misma asignatura cuente con múltiples tutores disponibles. |
| **Auditoría y Trazabilidad** | Inclusión de timestamps (`fecha_registro`, `fecha_solicitud`) para cumplimiento de requerimientos no funcionales de auditoría. |

---

## 3. Diccionario de Datos del Sistema (8 Tablas Normalizadas)

### 3.1 Tabla: `facultades`
Catálogo de unidades académicas mayores de la institución.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `id_facultad` | BIGINT | PK, AUTO_INCREMENT | Identificador único de la facultad. |
| `nombre` | VARCHAR(120) | NOT NULL, UNIQUE | Nombre oficial de la facultad (ej. *Facultad de Ingeniería*). |
| `codigo` | VARCHAR(20) | NOT NULL, UNIQUE | Código mnemotécnico institucional (ej. `FAC-ING`). |
| `descripcion`| VARCHAR(255) | NULL | Reseña o descripción del área del conocimiento. |
| `estado` | BOOLEAN | NOT NULL, DEFAULT TRUE | Estado operativo (activa/inactiva). |

---

### 3.2 Tabla: `programas`
Carreras profesionales pertenecientes a una facultad (Relación 1:N).

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `id_programa` | BIGINT | PK, AUTO_INCREMENT | Identificador único del programa académico. |
| `facultad_id` | BIGINT | NOT NULL, FK $\rightarrow$ `facultades(id_facultad)` | Facultad a la cual está adscrito. |
| `nombre` | VARCHAR(120) | NOT NULL | Nombre de la carrera (ej. *Ingeniería de Sistemas*). |
| `codigo` | VARCHAR(20) | NOT NULL, UNIQUE | Código del programa (ej. `PROG-SIS`). |
| `descripcion`| VARCHAR(255) | NULL | Perfil ocupacional o descripción curricular. |
| `estado` | BOOLEAN | NOT NULL, DEFAULT TRUE | Estado del programa académico. |

---

### 3.3 Tabla: `materias`
Asignaturas pertenecientes a un programa y ubicadas en su semestre de malla.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `id_materia` | BIGINT | PK, AUTO_INCREMENT | Identificador único de la asignatura. |
| `programa_id` | BIGINT | NOT NULL, FK $\rightarrow$ `programas(id_programa)` | Programa al que pertenece la asignatura. |
| `nombre` | VARCHAR(120) | NOT NULL | Nombre de la asignatura (ej. *Bases de Datos I*). |
| `codigo` | VARCHAR(20) | NOT NULL, UNIQUE | Código académico (ej. `SIS-401`). |
| `semestre` | INT | NOT NULL, CHECK (1..12) | Nivel o semestre de la malla curricular. |
| `creditos` | INT | NOT NULL, DEFAULT 3 | Cantidad de créditos académicos. |
| `descripcion`| VARCHAR(255) | NULL | Temáticas o competencias de la materia. |
| `estado` | BOOLEAN | NOT NULL, DEFAULT TRUE | Vigencia de la asignatura en el catálogo. |

---

### 3.4 Tabla: `usuarios`
Entidad base de seguridad, credenciales y autenticación para todos los roles.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `id_usuario` | BIGINT | PK, AUTO_INCREMENT | Identificador único del usuario. |
| `nombre` | VARCHAR(100) | NOT NULL | Nombres del usuario. |
| `apellido` | VARCHAR(100) | NOT NULL | Apellidos del usuario. |
| `correo` | VARCHAR(150) | NOT NULL, UNIQUE | Correo institucional (clave de autenticación). |
| `password` | VARCHAR(255) | NOT NULL | Hash criptográfico seguro mediante **BCrypt**. |
| `rol` | ENUM | NOT NULL | `ADMINISTRADOR`, `DOCENTE`, `ESTUDIANTE`. |
| `telefono` | VARCHAR(25) | NULL | Número telefónico de contacto. |
| `estado` | BOOLEAN | NOT NULL, DEFAULT TRUE | Estado de la cuenta (activo/suspendido). |
| `fecha_registro`| DATETIME | NOT NULL, DEFAULT NOW() | Fecha y hora de alta en el sistema. |

---

### 3.5 Tabla: `docentes`
Perfil académico especializado para los usuarios con rol `DOCENTE`.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `id_docente` | BIGINT | PK, AUTO_INCREMENT | Identificador del perfil docente. |
| `usuario_id` | BIGINT | NOT NULL, UNIQUE, FK $\rightarrow$ `usuarios` | Vínculo 1:1 con la cuenta de usuario. |
| `especialidad`| VARCHAR(150)| NULL | Áreas de experticia técnica y académica. |
| `descripcion` | VARCHAR(255)| NULL | Reseña profesional del tutor. |
| `disponibilidad`| VARCHAR(150)| NULL | Franjas horarias habituales de atención. |

---

### 3.6 Tabla: `docente_materias` (Tabla Intermedia N:M)
Relación muchos a muchos entre docentes y las materias que están facultados para dictar.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `docente_id` | BIGINT | NOT NULL, FK $\rightarrow$ `docentes(id_docente)` | Identificador del docente. |
| `materia_id` | BIGINT | NOT NULL, FK $\rightarrow$ `materias(id_materia)` | Identificador de la asignatura. |
| **PK Compuesta** | `(docente_id, materia_id)` | PRIMARY KEY | Garantiza que no se dupliquen asignaciones. |

---

### 3.7 Tabla: `estudiantes`
Perfil académico especializado para los usuarios con rol `ESTUDIANTE`.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `id_estudiante`| BIGINT | PK, AUTO_INCREMENT | Identificador del perfil de estudiante. |
| `usuario_id` | BIGINT | NOT NULL, UNIQUE, FK $\rightarrow$ `usuarios` | Vínculo 1:1 con la cuenta de usuario. |
| `programa_id` | BIGINT | NOT NULL, FK $\rightarrow$ `programas` | Carrera que cursa el estudiante. |
| `semestre_actual`| INT | NOT NULL, CHECK (1..12) | Semestre lectivo en el que se encuentra. |
| `codigo_estudiantil`| VARCHAR(30)| NOT NULL, UNIQUE | Matrícula o código oficial (ej. `SIS-2024-0089`). |

---

### 3.8 Tabla: `tutorias`
Sesiones de acompañamiento académico ofertadas por los docentes tutores.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `id_tutoria` | BIGINT | PK, AUTO_INCREMENT | Identificador único de la sesión de tutoría. |
| `docente_id` | BIGINT | NOT NULL, FK $\rightarrow$ `docentes` | Tutor titular que imparte la sesión. |
| `materia_id` | BIGINT | NOT NULL, FK $\rightarrow$ `materias` | Materia que se reforzará en la sesión. |
| `fecha` | DATE | NOT NULL | Fecha programada para la sesión. |
| `hora` | TIME | NOT NULL | Hora de inicio programada. |
| `modalidad` | ENUM | NOT NULL | `PRESENCIAL`, `VIRTUAL`. |
| `lugar` | VARCHAR(150) | NULL | Aula/laboratorio físico o enlace de reunión virtual. |
| `cupo_maximo`| INT | NOT NULL, DEFAULT 5 | Límite máximo de estudiantes por sesión. |
| `cupos_ocupados`| INT | NOT NULL, DEFAULT 0 | Contador de solicitudes confirmadas. |
| `descripcion`| VARCHAR(255) | NULL | Tema específico a tratar (ej. *Normalización 1FN-3FN*). |
| `estado` | ENUM | NOT NULL, DEFAULT 'DISPONIBLE' | `DISPONIBLE`, `OCUPADA`, `CANCELADA`, `FINALIZADA`. |

---

### 3.9 Tabla: `solicitudes`
Peticiones de inscripción y reserva de cupo realizadas por los estudiantes.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| `id_solicitud` | BIGINT | PK, AUTO_INCREMENT | Identificador de la solicitud. |
| `estudiante_id`| BIGINT | NOT NULL, FK $\rightarrow$ `estudiantes` | Alumno que solicita el acompañamiento. |
| `tutoria_id` | BIGINT | NOT NULL, FK $\rightarrow$ `tutorias` | Sesión a la cual se postula. |
| `fecha_solicitud`| DATETIME | NOT NULL, DEFAULT NOW() | Fecha y hora en la que se radicó la solicitud. |
| `estado` | ENUM | NOT NULL, DEFAULT 'PENDIENTE' | `PENDIENTE`, `ACEPTADA`, `RECHAZADA`, `CANCELADA`. |
| `mensaje_estudiante`| VARCHAR(255)| NULL | Duda puntual o motivo de la consulta. |
| `respuesta_docente` | VARCHAR(255)| NULL | Retroalimentación u observaciones del tutor. |

---

## 4. Script DDL Completo (MySQL 8 - AWS RDS)

El script SQL ejecutable se encuentra versionado en el repositorio oficial en:
`backend/sql/ddl_tutorias.sql`

```sql
-- DDL Resumen de Integridad Referencial
CREATE DATABASE IF NOT EXISTS tutorias_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tutorias_db;

-- Las tablas se encuentran enlazadas mediante llaves foráneas ON DELETE RESTRICT ON UPDATE CASCADE
-- asegurando el cumplimiento de la Tercera Forma Normal (3FN).
```

---

## 5. Conexión y Despliegue en Amazon Web Services (AWS RDS)

* **Motor:** MySQL Community 8.0.x
* **Clase de Instancia:** `db.t3.micro` / `db.t4g.micro` (Capa Gratuita de AWS)
* **Seguridad de Red:** Grupo de Seguridad (Security Group) configurado con puerto inbound `3306` accesible por el backend de Render mediante variables de entorno encriptadas (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).
