ENTREGA 2 – Modelado de Base de Datos y Backend Inicial

*Formato APA – Plantilla "Plantilla Entrega 2 BD y Backend_Inicial"*

---

**Página de título**

*Centro de la página*

Nombre de la Universidad
Programa de Ingeniería de Sistemas

ENTREGA 2
Modelado de Base de Datos y Backend Inicial

[Nombre del Proyecto]

Curso: [Nombre de la asignatura]
Docente: [Nombre del docente]
Integrantes:
1. Wadid Rivas Payares
2. Azael Espitia Toribio
3. Eduardo Julio Bettin Avilez
4. Jhon Jader Bertel Ortega
5. [Nombre integrante 5]

Enlace al repositorio GitHub: https://github.com/WRivxs/SGTU-Tutorias-Universitarias
Fecha de entrega: [dd/mm/aaaa]
---

## 1. Introducción
En esta segunda entrega se presenta el modelo de datos final (normalizado en 3FN), su despliegue en AWS RDS y la primera versión del backend implementado con Spring Boot 3.3.13.  El backend incluye todas las entidades JPA, sus repositorios y los endpoints CRUD necesarios para gestionar materias, usuarios, tutores, tutorías y solicitudes, cumpliendo con la arquitectura de cuatro capas definida en la Entrega 1.

## 2. Modelo Entidad‑Relación Final (Normalizado)

**[Inserte aquí la imagen del Diagrama ER final]**

### 2.1 Cambios respecto al modelo preliminar (Entrega 1)
| Cambio | Motivo |
|--------|--------|
| Separación de `usuarios` y `tutores` | Relación 1‑0..1; elimina atributos nulos. |
| Normalización de `solicitudes` | Tabla propia con FK a `usuarios` y `tutorias`. |
| Uso de enumeraciones (`rol`, `modalidad`, `estado`) | Garantiza integridad referencial a nivel de BD. |
| Índices adicionales (`idx_tutorias_estado`, `idx_solicitudes_estado`, `idx_usuarios_rol`) | Mejora rendimiento en filtros frecuentes. |
| Campos de auditoría (`fecha_registro`, `fecha_solicitud`) | Cumple RNF de trazabilidad. |

## 3. Diccionario de Datos
| Tabla | Campo | Tipo | Restricciones | Descripción |
|-------|-------|------|---------------|-------------|
| usuarios | id_usuario | BIGINT | PK, AUTO_INCREMENT | Identificador único del usuario. |
|  | nombre | VARCHAR(100) | NOT NULL | Nombre propio. |
|  | apellido | VARCHAR(100) | NOT NULL | Apellido. |
|  | correo | VARCHAR(150) | NOT NULL, UNIQUE | Dirección de correo (usuario único). |
|  | password | VARCHAR(255) | NOT NULL | Hash BCrypt de la contraseña. |
|  | rol | ENUM('ADMINISTRADOR','TUTOR','ESTUDIANTE') | NOT NULL | Tipo de usuario. |
|  | estado | BOOLEAN | NOT NULL, DEFAULT TRUE | Estado activo/inactivo. |
|  | fecha_registro | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de creación. |
| materias | id_materia | BIGINT | PK, AUTO_INCREMENT | Identificador de la materia. |
|  | nombre | VARCHAR(100) | NOT NULL | Nombre de la materia. |
|  | descripcion | VARCHAR(255) |  | Descripción opcional. |
|  | estado | BOOLEAN | NOT NULL, DEFAULT TRUE | Vigencia de la materia. |
| tutores | id_tutor | BIGINT | PK, AUTO_INCREMENT | Identificador del perfil de tutor. |
|  | usuario_id | BIGINT | NOT NULL, UNIQUE, FK → usuarios(id_usuario) | Usuario asociado (rol = TUTOR). |
|  | especialidad | VARCHAR(100) |  | Área de conocimiento. |
|  | descripcion | VARCHAR(255) |  | Texto descriptivo. |
|  | disponibilidad | VARCHAR(100) |  | Horarios disponibles. |
| tutorias | id_tutoria | BIGINT | PK, AUTO_INCREMENT | Identificador de la tutoría. |
|  | tutor_id | BIGINT | NOT NULL, FK → tutores(id_tutor) | Tutor que imparte la sesión. |
|  | materia_id | BIGINT | NOT NULL, FK → materias(id_materia) | Materia de la tutoría. |
|  | fecha | DATE | NOT NULL | Fecha programada. |
|  | hora | TIME | NOT NULL | Hora programada. |
|  | modalidad | ENUM('PRESENCIAL','VIRTUAL') | NOT NULL | Tipo de sesión. |
|  | lugar | VARCHAR(150) |  | Dirección física (solo PRESENCIAL). |
|  | descripcion | VARCHAR(255) |  | Detalles adicionales. |
|  | estado | ENUM('DISPONIBLE','OCUPADA','CANCELADA','FINALIZADA') | NOT NULL, DEFAULT 'DISPONIBLE' | Estado de la tutoría. |
| solicitudes | id_solicitud | BIGINT | PK, AUTO_INCREMENT | Identificador de la solicitud. |
|  | estudiante_id | BIGINT | NOT NULL, FK → usuarios(id_usuario) | Estudiante que solicita. |
|  | tutoria_id | BIGINT | NOT NULL, FK → tutorias(id_tutoria) | Tutoría solicitada. |
|  | fecha_solicitud | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de la petición. |
|  | estado | ENUM('PENDIENTE','ACEPTADA','RECHAZADA','CANCELADA') | NOT NULL, DEFAULT 'PENDIENTE' | Estado de la solicitud. |
|  | comentario | VARCHAR(255) |  | Texto opcional del estudiante. |

## 4. Scripts de Creación de Base de Datos (DDL)
**Archivo adjunto:** `sql/ddl_tutorias.sql` (ubicado en la raíz del proyecto).

```sql
-- =====================================================================
-- Sistema de Gestión de Tutorías Universitarias
-- Script DDL - Base de datos MySQL (AWS RDS)
-- Entrega 2 - Modelado de BD + Backend Inicial
-- =====================================================================

CREATE DATABASE IF NOT EXISTS tutorias_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tutorias_db;

-- Tabla: usuarios
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

-- Tabla: materias
CREATE TABLE materias (
    id_materia      BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)  NOT NULL,
    descripcion     VARCHAR(255),
    estado          BOOLEAN       NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- Tabla: tutores
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

-- Tabla: tutorias
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

-- Tabla: solicitudes
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

-- Índices adicionales
CREATE INDEX idx_tutorias_estado   ON tutorias(estado);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_usuarios_rol      ON usuarios(rol);

-- Datos de prueba (opcional)
INSERT INTO usuarios (nombre, apellido, correo, password, rol) VALUES
('Admin', 'Sistema', 'admin@tutorias.com', '$2a$10$examplehash', 'ADMINISTRADOR'),
('Wadid', 'Rivas', 'wadid.tutor@tutorias.com', '$2a$10$examplehash', 'TUTOR'),
('Eduardo', 'Bettin', 'eduardo.estudiante@tutorias.com', '$2a$10$examplehash', 'ESTUDIANTE');

INSERT INTO materias (nombre, descripcion) VALUES
('Bases de Datos', 'Modelado y administración de bases de datos relacionales'),
('Programación Web', 'Desarrollo de aplicaciones web con frameworks modernos');

INSERT INTO tutores (usuario_id, especialidad, descripcion, disponibilidad) VALUES
(2, 'Bases de Datos', 'Tutor con experiencia en modelado relacional', 'Lunes y miércoles 3-5pm');
```

## 5. Configuración de la Instancia AWS RDS
| Parámetro | Valor (ejemplo) |
|-----------|-----------------|
| DB instance identifier | tutorias-db-instance |
| Motor y versión | MySQL 8.0.35 |
| Clase de instancia | db.t3.micro |
| Región | us-east-1 |
| Nombre de la base de datos | tutorias_db |
| Endpoint | tutorias-db-instance.c9d2v6z8hdfg.us-east-1.rds.amazonaws.com:3306 |

### 5.1 Evidencia de instancia activa
**[Inserte aquí la captura de pantalla de la consola AWS – instancia en estado "Available"]**

### 5.2 Gestión segura de credenciales
- Las credenciales (`DB_USERNAME`, `DB_PASSWORD`) **no** están versionadas.
- Se declaran como **variables de entorno** en `run‑local.ps1` y se leen en `application.yml` mediante `${}`.
- En CI/CD se emplean *GitHub Secrets* para inyectarlas sin exposición.

## 6. Arquitectura del Proyecto Spring Boot
### 6.1 Dependencias utilizadas
| Dependencia | Propósito |
|-------------|-----------|
| spring-boot-starter-web | Exposición de endpoints REST (Tomcat embebido). |
| spring-boot-starter-data-jpa | Mapeo objeto‑relacional y repositorios JPA. |
| mysql‑connector‑j | Driver JDBC para MySQL/AWS RDS. |
| spring-boot-starter-validation | Bean Validation (`@NotBlank`, `@Email`, etc.). |
| lombok | Reduce boiler‑plate (`@Getter`, `@Setter`, `@Builder`). |
| spring-boot-starter-test | JUnit 5 + Mockito para pruebas unitarias. |

### 6.2 Estructura de paquetes (4 capas)
```
com.uaq.tutorias
├── config/                # Configuración global (CORS, Swagger, etc.)
├── controller/            # @RestController – exposición HTTP
├── service/               # Interfaces de lógica de negocio
│   └── impl/              # Implementaciones (@Service, @Transactional)
├── repository/            # Extiende JpaRepository para cada entidad
├── entity/                # Clases JPA (@Entity) – modelo de BD
├── exception/             # Manejo global de errores (@RestControllerAdvice)
└── TutoriasBackendApplication.java   # Clase principal (main)
```

## 7. Entidades JPA Implementadas (ejemplo)
| Entidad | Atributos principales | Anotaciones / Relaciones clave |
|---------|-----------------------|--------------------------------|
| Usuario | idUsuario, nombre, apellido, correo, password, rol, estado, fechaRegistro | `@Entity`, `@Table(name="usuarios")`, `@Id @GeneratedValue`, `@Enumerated(EnumType.STRING)` |
| Materia | idMateria, nombre, descripcion, estado | `@Entity`, `@Id @GeneratedValue`, `@Column(nullable=false)` |
| Tutoria | idTutoria, tutor, materia, fecha, hora, modalidad, lugar, descripcion, estado | `@Entity`, `@ManyToOne` (tutor → Tutor), `@ManyToOne` (materia → Materia), `@Enumerated(EnumType.STRING)` |

## 8. Repositorios (Spring Data JPA)
| Repositorio | Entidad asociada | Métodos personalizados |
|-------------|------------------|------------------------|
| UsuarioRepository | Usuario | `Optional<Usuario> findByCorreo(String correo);` |
| MateriaRepository | Materia | — (hereda CRUD) |
| TutoriaRepository | Tutoria | `List<Tutoria> findByEstado(String estado);` |
| TutorRepository | Tutor | `Optional<Tutor> findByUsuarioId(Long usuarioId);` |
| SolicitudRepository | Solicitud | `List<Solicitud> findByEstado(String estado);` |

## 9. Endpoints REST Implementados (CRUD)
### Entidad **Materias**
| Método | Endpoint | Descripción | Comentario |
|--------|----------|-------------|------------|
| GET | /api/materias | Lista todas las materias (opcional `?estado=true`). | Devuelve JSON array. |
| GET | /api/materias/{id} | Obtiene materia por id. | 404 si no existe. |
| POST | /api/materias | Crea una nueva materia. | Valida `nombre` no nulo. |
| PUT | /api/materias/{id} | Actualiza datos de la materia. | Sólo campos enviados se actualizan. |
| DELETE | /api/materias/{id} | Elimina la materia (solo si no está referenciada). | 409 si existen tutorías vinculadas. |

### Entidad **Tutorías**
| Método | Endpoint | Descripción | Comentario |
|--------|----------|-------------|------------|
| GET | /api/tutorias | Lista tutorías; filtro opcional `?estado=DISPONIBLE`. | Usa `TutoriaRepository.findByEstado`. |
| GET | /api/tutorias/{id} | Detalle de una tutoría. | 404 si no existe. |
| POST | /api/tutorias | Programa una nueva tutoría. | Verifica existencia de `tutor_id` y `materia_id`. |
| PUT | /api/tutorias/{id} | Modifica datos (fecha, hora, estado, etc.). | Cambios de estado (`OCUPADA`, `CANCELADA`). |
| DELETE | /api/tutorias/{id} | Elimina la tutoría (cascada a solicitudes). | 200 OK si se elimina. |

*Los controladores de `usuarios`, `tutores` y `solicitudes` siguen la misma plantilla CRUD.*

## 10. Evidencia de Pruebas en Postman
**[Inserte aquí captura de pantalla de Postman – petición GET `/api/materias` (respuesta 200)]**
**[Inserte aquí captura de pantalla de Postman – petición POST `/api/materias` (cuerpo válido, respuesta 201)]**
**[Inserte aquí captura de pantalla de Postman – petición PUT `/api/materias/1` (respuesta 200)]**
**[Inserte aquí captura de pantalla de Postman – petición DELETE `/api/materias/1` (respuesta 200)]**
*Se muestra al menos un caso de éxito y un caso de error para cada entidad.*

## 11. Repositorio en GitHub
**Enlace:** https://github.com/WRivxs/SGTU-Tutorias-Universitarias

### 11.1 Resumen del README.md
- **Descripción del proyecto:** objetivo, stack tecnológico y arquitectura de 4 capas.
- **Requisitos previos:** JDK 17, Maven, PowerShell/Bash.
- **Variables de entorno:** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `SERVER_PORT`.
- **Script de ejecución local:** `run‑local.ps1` (exporta variables y lanza `mvn spring-boot:run`).
- **Compilación & pruebas:** `mvn clean install`, `mvn test`.
- **Endpoints REST:** tabla resumen de recursos.
- **Colección Postman:** archivo `postman/Tutorias-API.postman_collection.json`.
- **Despliegue en AWS RDS:** pasos para crear la instancia y ejecutar `ddl_tutorias.sql`.
- **Contribución:** normas de commit, `.gitignore` (excluye credenciales y `run‑local.ps1`).

## 12. Conclusiones y Retos Encontrados
| Área | Dificultad | Solución |
|------|------------|----------|
| Modelado de datos | Redundancia entre usuarios y tutores en la versión preliminar. | Creación de tabla `tutores` con relación 1‑0..1; normalización a 3FN. |
| Conexión a AWS RDS | Bloqueo del puerto 3306 por la VPC. | Configuración de Security Group para permitir inbound desde la IP del equipo; uso de variables de entorno. |
| Configuración Spring Boot | Errores de parsing en `application.yml` por comillas faltantes. | Uso de `${}` y pruebas locales antes del commit. |
| Validación de datos | DTOs sin constraints permitían datos inválidos. | Añadido Bean Validation (`@NotBlank`, `@Email`, `@Size`) y `@Valid` en controladores. |
| Pruebas Postman | 500 al crear tutorías con `tutor_id` inexistente. | Verificación de existencia en el servicio y retorno 404 con mensaje claro. |
| Documentación | Mantener sincronizado README, script `run‑local.ps1` y colección Postman. | Checklist antes de subir y generación automática de la colección mediante pruebas de integración. |

**Lección clave:** la coherencia entre el diseño (Entrega 1) y la implementación (Entrega 2) es esencial; cualquier desviación debe quedar documentada y justificada, tal como se muestra en este informe.

---

*Fin del documento.*
