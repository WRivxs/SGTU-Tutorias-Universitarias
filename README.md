# Sistema de Gestión de Tutorías Universitarias (SGTU)

Repositorio principal del proyecto **SGTU (Sistema de Gestión de Tutorías Universitarias)**, estructurado como monorepo para alojar de forma organizada tanto el backend como el frontend y la documentación del sistema.

---

## 👥 Integrantes del Equipo
- **Wadid Rivas Payares** — Encargado Backend
- **Azael Espitia Toribio** — Encargado Base de Datos / Infraestructura AWS
- **Eduardo Julio Bettin Avilez** — Líder Técnico / Frontend
- **Jhon Jader Bertel Ortega** — Encargado QA / Documentación

---

## 📁 Estructura del Repositorio

```text
SGTU-Tutorias-Universitarias/
├── backend/                  # API REST en Spring Boot 3 (Java 17, JPA, MySQL RDS)
│   ├── src/                  # Código fuente (Controllers, Services, Repositories, Entities)
│   ├── sql/                  # Scripts DDL de base de datos
│   ├── postman/              # Colecciones de pruebas Postman
│   ├── pom.xml               # Configuración Maven
│   └── README.md             # Guía técnica específica del Backend
├── frontend/                 # Aplicación Web Cliente en Angular
│   └── README.md             # Guía técnica específica del Frontend
├── docs/                     # Documentación general y entregables del proyecto
└── README.md                 # Descripción general del repositorio
```

---

## 🚀 Módulos del Sistema

### 1. Backend (`/backend`)
Desarrollado con **Java 17** y **Spring Boot 3.3.x**, conectado a una base de datos MySQL en AWS RDS. Provee la API REST para la gestión de usuarios, materias, tutores, tutorías y solicitudes.
- Consulta [backend/README.md](backend/README.md) para instrucciones de compilación, ejecución local, variables de entorno y endpoints disponibles.

### 2. Frontend (`/frontend`)
Desarrollado en **Angular**, proveerá las interfaces para estudiantes, tutores y administradores.
- Consulta [frontend/README.md](frontend/README.md) para más detalles.

### 3. Documentación (`/docs`)
Contiene los documentos formales de entrega, especificaciones de arquitectura y diagramas del sistema.
